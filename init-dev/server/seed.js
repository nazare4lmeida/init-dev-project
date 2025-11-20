require("dotenv").config();
const mongoose = require("mongoose");
const Course = require("./models/Course");

// Função simples para criar slug se você não tiver a lib instalada
const createSlug = (text) =>
  text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-") // Substitui espaços por -
    .replace(/[^\w\-]+/g, "") // Remove caracteres especiais
    .replace(/\-\-+/g, "-") // Substitui múltiplos - por um único -
    .replace(/^-+/, "") // Remove - do início
    .replace(/-+$/, ""); // Remove - do fim

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("🔌 Conectado ao MongoDB...");

    const title = "Curso de Certificação Teste";

    // 1. Criar Curso com SLUG
    const course = await Course.create({
      title: title,
      slug: createSlug(title), // <--- ADICIONEI ISTO AQUI
      description: "Um curso criado via script para testar o PDF.",
      language: "Node.js",
      availableSlots: 50,
      image: "https://via.placeholder.com/150",
    });

    console.log("✅ Curso Criado!");
    console.log("🆔 ID DO CURSO:", course._id.toString());
    console.log("🔗 SLUG:", course.slug);

    process.exit();
  })
  .catch((err) => {
    console.error("❌ Erro:", err.message); // Mostra erro mais limpo
    process.exit(1);
  });
