const mongoose = require('mongoose');

// =======================================================
// SUB-SCHEMA: Module
// Define a estrutura para cada módulo dentro do curso.
// =======================================================
const moduleSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    order: { 
        type: Number,
        required: true,
    },
    // Referência para as Lições
    lessons: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lesson' 
    }]
});

// =======================================================
// PRINCIPAL SCHEMA: Course
// =======================================================
const courseSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Please add a title'],
        },
        description: {
            type: String,
            required: [true, 'Please add a description'],
        },
        language: {
            type: String,
            required: true,
        },
        slots: { 
            type: Number,
            required: true,
            default: 50,
        },
        availableSlots: { 
            type: Number,
            default: 50,
        },
        imagePaths: { 
            type: [String],
        },
        
        // Array de Módulos
        modules: [moduleSchema], 
        
        // Slug Automático
        slug: { 
            type: String,
            unique: true,
            // RETIREI O REQUIRED: TRUE AQUI PARA O PRE-SAVE FUNCIONAR LIVREMENTE
        } 
    },
    {
        timestamps: true,
    }
); // <--- IMPORTANTE: FECHEI O SCHEMA AQUI

// --- MIDDLEWARE: Gera o Slug antes de salvar ---
courseSchema.pre('save', function(next) {
  if (!this.isModified('title') && this.slug) {
    return next();
  }

  // Gera slug baseado no título se ele não existir
  if (this.title && !this.slug) {
      this.slug = this.title
        .toString()
        .toLowerCase()
        .replace(/\s+/g, '-')        // Espaços viram -
        .replace(/[^\w\-]+/g, '')    // Remove caracteres especiais
        .replace(/\-\-+/g, '-')      // Remove múltiplos -
        .replace(/^-+/, '')          // Remove - do começo
        .replace(/-+$/, '');         // Remove - do fim
  }
  
  next();
});

module.exports = mongoose.model('Course', courseSchema);