import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import {
  createBlog,
  fetchBlogs,
  updateBlog,
} from "../../store/slices/blogSlice";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { fetchCategories } from "../../store/slices/categorySlice";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const BlogForm = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { blogs, status, error } = useSelector((state) => state.blogs);
  const { categories } = useSelector((state) => state.categories);

  const isEditMode = Boolean(id);
  const blog = blogs.find((blog) => blog._id === id);

  useEffect(() => {
    if (isEditMode && !blog) {
      dispatch(fetchBlogs());
    }
    dispatch(fetchCategories());
  }, [dispatch, blog, isEditMode]);

  const validationSchema = Yup.object({
    title: Yup.string().required("Başlık alanı zorunludur"),
    content: Yup.string().required("İçerik alanı zorunludur"),
    category: Yup.string().required("Kategori alanı zorunludur"),
  });

  const handleSubmit = (values, { resetForm }) => {
    if (isEditMode) {
      dispatch(updateBlog({ id, blogData: values }))
        .then(() => {
          toast.success("Blog başarıyla güncellendi");
          navigate("/blogs");
        })
        .catch(() => toast.error(error || "Bir hata oluştu"));
    } else {
      dispatch(createBlog(values))
        .then(() => {
          resetForm();
          toast.success("Blog başarıyla eklendi. Admin Onayı bekleniyor.");
          navigate("/blogs");
        })
        .catch(() => toast.error(error || "Bir hata oluştu"));
    }
  };

  if (status === "loading")
    return (
      <ClipLoader
        color="blue"
        className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2"
      />
    );

  if (status === "failed") return toast.error(error);

  return (
    <div>
      <Formik
        initialValues={{
          title: blog?.title || "",
          content: blog?.content || "",
          category: blog?.category?._id || "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, setFieldValue, values }) => (
          <Form className="space-y-4">
            <div>
              <label htmlFor="title" className="block font-semibold">
                Başlık
              </label>
              <Field
                name="title"
                type="text"
                className="w-full p-2 border rounded"
              />
              <ErrorMessage
                name="title"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
            <div>
              <label htmlFor="content" className="block font-semibold">
                İçerik
              </label>
              <ReactQuill
                value={values.content}
                onChange={(value) => setFieldValue("content", value)}
                modules={{
                  toolbar: [
                    [{ header: "1" }, { header: "2" }, { font: [] }],
                    [{ list: "ordered" }, { list: "bullet" }],
                    ["bold", "italic", "underline"],
                    ["link"],
                    [{ align: [] }],
                    ["image"],
                  ],
                  clipboard: {
                    matchVisual: false,
                  },
                }}
                formats={[
                  "header",
                  "font",
                  "list",
                  "bold",
                  "italic",
                  "underline",
                  "link",
                  "align",
                  "image",
                ]}
                className="w-full"
              />
              <ErrorMessage
                name="content"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
            <div>
              <label htmlFor="category" className="block font-semibold">
                Kategori
              </label>
              <Field
                name="category"
                as="select"
                className="w-full p-2 border rounded"
              >
                <option value="">Kategori Seçiniz</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </Field>
              <ErrorMessage
                name="category"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`${
                isEditMode ? "bg-green-500" : "bg-blue-500"
              } text-white px-4 py-2 rounded`}
            >
              {isSubmitting
                ? isEditMode
                  ? "Güncelleniyor..."
                  : "Gönderiliyor..."
                : isEditMode
                ? "Güncelle"
                : "Ekle"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default BlogForm;
