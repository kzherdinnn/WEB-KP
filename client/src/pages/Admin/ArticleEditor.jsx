import { useState, useEffect } from "react";
import { useAppContext } from "../../context/AppContext";
import { useNavigate, useParams } from "react-router-dom";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import {
    FaArrowLeft,
    FaSave,
    FaImage,
    FaSpinner,
    FaBold,
    FaItalic,
    FaUnderline,
    FaListUl,
    FaListOl,
    FaQuoteLeft,
    FaCode,
    FaLink,
    FaAlignLeft,
    FaAlignCenter,
    FaAlignRight,
    FaAlignJustify,
    FaHighlighter,
    FaTable,
    FaUndo,
    FaRedo,
    FaStrikethrough,
    FaTasks,
    FaPalette,
} from "react-icons/fa";
import toast from "react-hot-toast";

const ArticleEditor = () => {
    const { axios } = useAppContext();
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = !!id;

    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(isEditing);
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        category: "Tips Audio",
        content: "",
        excerpt: "",
        author: "Admin",
        isPublished: true,
        image: null,
        imageUrl: "",
    });

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3, 4],
                },
            }),
            Image.configure({
                HTMLAttributes: {
                    class: "rounded-lg max-w-full h-auto my-4",
                },
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: "text-teal-600 underline hover:text-teal-700",
                },
            }),
            Underline,
            TextAlign.configure({
                types: ["heading", "paragraph"],
            }),
            Highlight.configure({
                multicolor: true,
            }),
            TextStyle,
            Color,
            Table.configure({
                resizable: true,
                HTMLAttributes: {
                    class: "border-collapse table-auto w-full my-4",
                },
            }),
            TableRow,
            TableCell.configure({
                HTMLAttributes: {
                    class: "border border-gray-300 p-2",
                },
            }),
            TableHeader.configure({
                HTMLAttributes: {
                    class: "border border-gray-300 p-2 bg-gray-100 font-bold",
                },
            }),
            TaskList.configure({
                HTMLAttributes: {
                    class: "list-none pl-0",
                },
            }),
            TaskItem.configure({
                nested: true,
                HTMLAttributes: {
                    class: "flex items-start gap-2",
                },
            }),
        ],
        content: formData.content,
        editorProps: {
            attributes: {
                class: "prose prose-sm max-w-none p-4 min-h-[400px] focus:outline-none",
            },
        },
        onUpdate: ({ editor }) => {
            setFormData(prev => ({ ...prev, content: editor.getHTML() }));
        },
    });

    useEffect(() => {
        if (isEditing) {
            fetchArticle();
        }
    }, [id]);

    useEffect(() => {
        if (editor && formData.content && editor.getHTML() !== formData.content) {
            editor.commands.setContent(formData.content);
        }
    }, [editor, formData.content]);

    const fetchArticle = async () => {
        try {
            const { data } = await axios.get(`/api/articles/detail/${id}`);
            if (data.success) {
                const article = data.data;
                setFormData({
                    title: article.title,
                    category: article.category,
                    content: article.content,
                    excerpt: article.excerpt,
                    author: article.author,
                    isPublished: article.isPublished,
                    image: null,
                    imageUrl: article.image,
                });
            }
        } catch (error) {
            toast.error("Gagal memuat artikel");
            navigate("/admin/articles");
        } finally {
            setInitialLoading(false);
        }
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFormData({
                ...formData,
                image: e.target.files[0],
                imageUrl: URL.createObjectURL(e.target.files[0]),
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = new FormData();
            data.append("title", formData.title);
            data.append("category", formData.category);
            data.append("content", formData.content);
            data.append("excerpt", formData.excerpt);
            data.append("author", formData.author);
            data.append("isPublished", formData.isPublished);

            if (formData.image) {
                data.append("image", formData.image);
            } else if (formData.imageUrl && !formData.image) {
                data.append("image", formData.imageUrl);
            }

            if (isEditing) {
                await axios.put(`/api/articles/${id}`, data);
                toast.success("Artikel berhasil diperbarui");
            } else {
                await axios.post("/api/articles", data);
                toast.success("Artikel berhasil dibuat");
            }
            navigate("/admin/articles");
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Gagal menyimpan artikel");
        } finally {
            setLoading(false);
        }
    };

    const handleInsertImage = () => {
        const url = window.prompt("Masukkan URL gambar:");
        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    };

    const handleInsertLink = () => {
        const url = window.prompt("Masukkan URL link:");
        if (url) {
            editor.chain().focus().setLink({ href: url }).run();
        }
    };

    const handleSetColor = (color) => {
        editor.chain().focus().setColor(color).run();
        setShowColorPicker(false);
    };

    const colors = [
        "#000000", // Black
        "#374151", // Gray
        "#EF4444", // Red
        "#F97316", // Orange
        "#F59E0B", // Amber
        "#10B981", // Green
        "#14B8A6", // Teal
        "#3B82F6", // Blue
        "#6366F1", // Indigo
        "#8B5CF6", // Purple
        "#EC4899", // Pink
    ];

    const MenuBar = () => {
        if (!editor) return null;

        return (
            <div className="border border-gray-300 rounded-t-lg bg-gray-50 p-2 flex flex-wrap gap-1">
                {/* Undo/Redo */}
                <button
                    type="button"
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                    className="p-2 rounded hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Undo"
                >
                    <FaUndo />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                    className="p-2 rounded hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Redo"
                >
                    <FaRedo />
                </button>

                <div className="w-px bg-gray-300 mx-1"></div>

                {/* Headings */}
                <select
                    onChange={(e) => {
                        const level = parseInt(e.target.value);
                        if (level === 0) {
                            editor.chain().focus().setParagraph().run();
                        } else {
                            editor.chain().focus().toggleHeading({ level }).run();
                        }
                    }}
                    className="px-3 py-2 rounded hover:bg-gray-200 text-sm font-medium border-0 bg-transparent cursor-pointer"
                    title="Heading"
                >
                    <option value="0">Paragraph</option>
                    <option value="1">Heading 1</option>
                    <option value="2">Heading 2</option>
                    <option value="3">Heading 3</option>
                    <option value="4">Heading 4</option>
                </select>

                <div className="w-px bg-gray-300 mx-1"></div>

                {/* Text Formatting */}
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("bold") ? "bg-gray-300" : ""}`}
                    title="Bold"
                >
                    <FaBold />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("italic") ? "bg-gray-300" : ""}`}
                    title="Italic"
                >
                    <FaItalic />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("underline") ? "bg-gray-300" : ""}`}
                    title="Underline"
                >
                    <FaUnderline />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("strike") ? "bg-gray-300" : ""}`}
                    title="Strikethrough"
                >
                    <FaStrikethrough />
                </button>

                <div className="w-px bg-gray-300 mx-1"></div>

                {/* Color Picker */}
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setShowColorPicker(!showColorPicker)}
                        className="p-2 rounded hover:bg-gray-200"
                        title="Text Color"
                    >
                        <FaPalette />
                    </button>
                    {showColorPicker && (
                        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-2 z-10 flex gap-1">
                            {colors.map((color) => (
                                <button
                                    key={color}
                                    type="button"
                                    onClick={() => handleSetColor(color)}
                                    className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition"
                                    style={{ backgroundColor: color }}
                                    title={color}
                                />
                            ))}
                        </div>
                    )}
                </div>

                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleHighlight({ color: "#fef08a" }).run()}
                    className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("highlight") ? "bg-yellow-200" : ""}`}
                    title="Highlight"
                >
                    <FaHighlighter />
                </button>

                <div className="w-px bg-gray-300 mx-1"></div>

                {/* Text Alignment */}
                <button
                    type="button"
                    onClick={() => editor.chain().focus().setTextAlign("left").run()}
                    className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: "left" }) ? "bg-gray-300" : ""}`}
                    title="Align Left"
                >
                    <FaAlignLeft />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().setTextAlign("center").run()}
                    className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: "center" }) ? "bg-gray-300" : ""}`}
                    title="Align Center"
                >
                    <FaAlignCenter />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().setTextAlign("right").run()}
                    className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: "right" }) ? "bg-gray-300" : ""}`}
                    title="Align Right"
                >
                    <FaAlignRight />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().setTextAlign("justify").run()}
                    className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: "justify" }) ? "bg-gray-300" : ""}`}
                    title="Align Justify"
                >
                    <FaAlignJustify />
                </button>

                <div className="w-px bg-gray-300 mx-1"></div>

                {/* Lists */}
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("bulletList") ? "bg-gray-300" : ""}`}
                    title="Bullet List"
                >
                    <FaListUl />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("orderedList") ? "bg-gray-300" : ""}`}
                    title="Ordered List"
                >
                    <FaListOl />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleTaskList().run()}
                    className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("taskList") ? "bg-gray-300" : ""}`}
                    title="Task List"
                >
                    <FaTasks />
                </button>

                <div className="w-px bg-gray-300 mx-1"></div>

                {/* Quote & Code */}
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("blockquote") ? "bg-gray-300" : ""}`}
                    title="Quote"
                >
                    <FaQuoteLeft />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("codeBlock") ? "bg-gray-300" : ""}`}
                    title="Code Block"
                >
                    <FaCode />
                </button>

                <div className="w-px bg-gray-300 mx-1"></div>

                {/* Table */}
                <button
                    type="button"
                    onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
                    className="p-2 rounded hover:bg-gray-200"
                    title="Insert Table"
                >
                    <FaTable />
                </button>

                <div className="w-px bg-gray-300 mx-1"></div>

                {/* Media */}
                <button
                    type="button"
                    onClick={handleInsertImage}
                    className="p-2 rounded hover:bg-gray-200"
                    title="Insert Image"
                >
                    <FaImage />
                </button>
                <button
                    type="button"
                    onClick={handleInsertLink}
                    className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("link") ? "bg-gray-300" : ""}`}
                    title="Insert Link"
                >
                    <FaLink />
                </button>
            </div>
        );
    };

    if (initialLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
            </div>
        );
    }

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-8 bg-gray-50 min-h-screen">
            <div className="max-w-5xl mx-auto">
                <div className="mb-6">
                    <button
                        onClick={() => navigate("/admin/articles")}
                        className="text-gray-500 hover:text-teal-600 flex items-center gap-2 transition mb-2"
                    >
                        <FaArrowLeft /> Kembali ke Daftar
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900 font-playfair">
                        {isEditing ? "Edit Artikel" : "Tulis Artikel Baru"}
                    </h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Judul Artikel
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.title}
                                onChange={(e) =>
                                    setFormData({ ...formData, title: e.target.value })
                                }
                                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-teal-500 font-medium text-lg"
                                placeholder="Contoh: Cara Merawat Audio Mobil..."
                            />
                        </div>

                        {/* Category & Author */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Kategori
                                </label>
                                <select
                                    value={formData.category}
                                    onChange={(e) =>
                                        setFormData({ ...formData, category: e.target.value })
                                    }
                                    className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-teal-500"
                                >
                                    <option value="Tips Audio">Tips Audio</option>
                                    <option value="Perawatan">Perawatan</option>
                                    <option value="Modifikasi">Modifikasi</option>
                                    <option value="Keamanan">Keamanan</option>
                                    <option value="Berita">Berita</option>
                                    <option value="Review Produk">Review Produk</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Penulis
                                </label>
                                <input
                                    type="text"
                                    value={formData.author}
                                    onChange={(e) =>
                                        setFormData({ ...formData, author: e.target.value })
                                    }
                                    className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-teal-500"
                                />
                            </div>
                        </div>

                        {/* Excerpt */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Ringkasan (Excerpt)
                            </label>
                            <textarea
                                rows="2"
                                required
                                value={formData.excerpt}
                                onChange={(e) =>
                                    setFormData({ ...formData, excerpt: e.target.value })
                                }
                                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-teal-500 text-sm"
                                placeholder="Ringkasan singkat untuk ditampilkan di kartu artikel..."
                            ></textarea>
                        </div>

                        {/* Cover Image */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Gambar Sampul
                            </label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition relative">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                {formData.imageUrl ? (
                                    <div className="relative inline-block">
                                        <img
                                            src={formData.imageUrl}
                                            alt="Preview"
                                            className="h-48 object-cover rounded-lg shadow-sm"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 hover:opacity-100 transition rounded-lg">
                                            <span className="text-sm font-medium">Ganti Gambar</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-gray-500">
                                        <FaImage className="mx-auto text-4xl mb-2 text-gray-300" />
                                        <p className="text-sm">
                                            Klik atau tarik gambar ke sini untuk mengunggah
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Rich Text Editor */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Konten Artikel
                            </label>
                            <div className="border border-gray-300 rounded-lg overflow-hidden">
                                <MenuBar />
                                <EditorContent
                                    editor={editor}
                                    className="prose prose-sm max-w-none p-4 min-h-[500px] focus:outline-none bg-white"
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                                💡 Tips: Gunakan heading untuk struktur artikel yang baik. Tambahkan gambar dan bold untuk highlight poin penting.
                            </p>
                        </div>

                        {/* Status */}
                        <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.isPublished}
                                    onChange={(e) =>
                                        setFormData({ ...formData, isPublished: e.target.checked })
                                    }
                                    className="w-5 h-5 text-teal-600 rounded focus:ring-teal-500"
                                />
                                <span className="text-gray-700 font-medium">
                                    Publikasikan Langsung
                                </span>
                            </label>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={() => navigate("/admin/articles")}
                            className="px-6 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg transition font-medium"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition font-medium flex items-center gap-2 shadow-lg shadow-teal-600/20 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <FaSpinner className="animate-spin" /> Menyimpan...
                                </>
                            ) : (
                                <>
                                    <FaSave /> Simpan Artikel
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ArticleEditor;
