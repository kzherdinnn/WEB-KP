import { Webhook } from "svix";
import userModel from "../models/user.models.js";

const clerkWebHooks = async (req, res) => {
    try {
        const WEBHOOK_SECRET = process.env.SIGNING_SECRET;
        if (!WEBHOOK_SECRET) {
            throw new Error("SIGNING_SECRET tidak ditemukan di file .env");
        }

        const headers = req.headers;
        const payload = req.body;

        const whook = new Webhook(WEBHOOK_SECRET);
        let evt;

        try {
            evt = whook.verify(payload, headers);
        } catch (err) {
            console.error("Error verifikasi dari Svix:", err.message);
            return res.status(400).json({ success: false, message: "Verifikasi webhook gagal" });
        }

        const { data, type } = evt;

        console.log(`Webhook diterima: Tipe = ${type}`);

        // ✅ PERUBAHAN: Kita hanya proses jika event-nya relevan
        if (type === "user.created" || type === "user.updated") {
            // Validasi email HANYA untuk event yang membutuhkannya
            if (!data.email_addresses?.[0]?.email_address) {
                console.error("Alamat email tidak ditemukan untuk event:", type);
                // Kirim respons sukses agar Clerk tidak mengirim ulang
                return res.status(200).json({ success: true, message: "Event diterima tapi data tidak lengkap" });
            }

            const userData = {
                _id: data.id,
                email: data.email_addresses[0].email_address,
                username: data.username || `${data.first_name || ''} ${data.last_name || ''}`.trim() || data.email_addresses[0].email_address.split('@')[0],
                image: data.image_url,
            };

            if (type === "user.created") {
                await userModel.create(userData);
                console.log(`Pengguna BERHASIL dibuat di database. ID: ${userData._id}`);
            } else if (type === "user.updated") {
                await userModel.findOneAndUpdate({ _id: data.id }, userData, { new: true });
                console.log(`Pengguna BERHASIL diperbarui di database. ID: ${userData._id}`);
            }
        }

        if (type === "user.deleted") {
            // Untuk user.deleted, data yang tersedia mungkin minimal
            await userModel.findOneAndDelete({ _id: data.id });
            console.log(`Pengguna BERHASIL dihapus dari database. ID: ${data.id}`);
        }

        // Kirim respons sukses untuk semua event yang diterima
        return res.status(200).json({ success: true, message: "Webhook berhasil diproses" });

    } catch (error) {
        console.error("Error dalam handler webhook:", error.message);
        return res.status(500).json({ success: false, message: "Terjadi kesalahan internal" });
    }
};

export default clerkWebHooks;