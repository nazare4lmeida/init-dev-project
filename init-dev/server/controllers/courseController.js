const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const slugify = require('slugify'); 
const mongoose = require('mongoose'); 

// Funções existentes
const getCourses = async (req, res) => {
    const courses = await Course.find();
    res.status(200).json(courses);
};

const getCoursesAdmin = async (req, res) => {
    const courses = await Course.find();
    res.status(200).json(courses);
};

const createCourse = async (req, res) => {
    const { title, description, language, slots } = req.body;
    const images = req.files.map(file => `/uploads/${file.filename}`);

    if (!title || !description || !language || !slots) {
        return res.status(400).json({ message: 'Please include all fields' });
    }

    const slug = slugify(title, { lower: true, strict: true, locale: 'pt' });

    try {
        const course = await Course.create({
            title,
            description,
            language,
            slots,
            availableSlots: slots,
            imagePaths: images,
            slug, 
        });
        res.status(201).json(course);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Um curso com este título já existe. Tente um título diferente.' });
        }
        res.status(500).json({ message: 'Erro ao criar curso', error: error.message });
    }
};

const updateCourse = async (req, res) => {
    const { title, description, language, slots } = req.body;
    const course = await Course.findById(req.params.id);

    if (!course) {
        return res.status(404).json({ message: 'Curso não encontrado.' });
    }

    const slug = title ? slugify(title, { lower: true, strict: true, locale: 'pt' }) : course.slug;

    const updateFields = {
        title,
        description,
        language,
        slots,
        availableSlots: slots,
        imagePaths: req.files && req.files.length > 0 ? req.files.map(file => `/uploads/${file.filename}`) : course.imagePaths,
        slug, 
    };

    const updatedCourse = await Course.findByIdAndUpdate(req.params.id, updateFields, { new: true });

    res.status(200).json(updatedCourse);
};

const deleteCourse = async (req, res) => {
    const course = await Course.findById(req.params.id);

    if (!course) {
        return res.status(404).json({ message: 'Curso não encontrado.' });
    }

    await course.deleteOne();
    await Lesson.deleteMany({ course: req.params.id }); 

    res.status(200).json({ message: 'Curso e todo o conteúdo relacionado removidos com sucesso.' });
};

// =======================================================
// FUNÇÃO: Obter Curso Detalhado para Admin (SOLUÇÃO DO ERRO)
// =======================================================
/**
 * @desc Obter detalhes de um curso para edição de conteúdo (Admin)
 * @route GET /api/admin/courses/:id/details
 * @access Private (Admin Only)
 */
const getCourseDetailsForAdmin = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id)
            .populate({
                path: 'modules.lessons', 
                model: 'Lesson',
                select: 'title order type' 
            })
            .lean(); 

        if (!course) {
            return res.status(404).json({ message: 'Curso não encontrado.' });
        }
        
        course.modules.sort((a, b) => a.order - b.order);
        
        course.modules.forEach(module => {
            if (module.lessons) {
                module.lessons.sort((a, b) => a.order - b.order);
            }
        });
        
        res.status(200).json(course);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar detalhes do curso.', error: error.message });
    }
};


// =======================================================
// NOVA FUNÇÃO: Obter Curso Detalhado para Usuário (Público/Logado)
// =======================================================
/**
 * @desc Obter detalhes de um curso, incluindo módulos e lições para visualização do usuário.
 * @route GET /api/courses/:slug
 * @access Public (ou Private para usuários logados)
 */
const getCourseDetailsPublic = async (req, res) => {
    try {
        const { slug } = req.params;
        
        // Busca o curso por SLUG (URL amigável) e popula os módulos com os dados das lições.
        const course = await Course.findOne({ slug })
            .populate({
                path: 'modules.lessons', 
                model: 'Lesson',
                select: 'title order type' // Seleciona apenas o necessário para a visualização
            })
            .lean(); 

        if (!course) {
            return res.status(404).json({ message: 'Curso não encontrado.' });
        }
        
        // Ordena módulos e lições para exibição correta
        course.modules.sort((a, b) => a.order - b.order);
        course.modules.forEach(module => {
            if (module.lessons) {
                module.lessons.sort((a, b) => a.order - b.order);
            }
        });
        
        res.status(200).json(course);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar detalhes do curso.', error: error.message });
    }
};

// =======================================================
// FUNÇÃO: Adicionar Módulo
// =======================================================
const addModuleToCourse = async (req, res) => {
    const { courseId } = req.params;
    const { title, description, order } = req.body;

    if (!title || order === undefined) {
        return res.status(400).json({ message: 'Por favor, forneça o título e a ordem do módulo.' });
    }

    try {
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Curso não encontrado.' });
        }

        const newModule = {
            title,
            description: description || '',
            order: parseInt(order),
            lessons: [], 
        };

        course.modules.push(newModule);
        await course.save();

        const addedModule = course.modules[course.modules.length - 1];
        res.status(201).json({ 
            message: 'Módulo adicionado com sucesso!',
            module: addedModule
        });

    } catch (error) {
        res.status(500).json({ message: 'Erro ao adicionar módulo.', error: error.message });
    }
};

// =======================================================
// FUNÇÃO: Adicionar Lição
// =======================================================
const addLessonToModule = async (req, res) => {
    const { courseId, moduleId } = req.params;
    const { title, content, type, order } = req.body; 

    if (!title || !content || order === undefined) {
        return res.status(400).json({ message: 'Por favor, forneça o título, conteúdo e a ordem da lição.' });
    }
    
    if (!mongoose.Types.ObjectId.isValid(moduleId) || !mongoose.Types.ObjectId.isValid(courseId)) {
        return res.status(400).json({ message: 'IDs de Curso ou Módulo inválidos.' });
    }

    try {
        const lesson = await Lesson.create({
            title,
            content,
            type: type || 'text',
            order: parseInt(order),
            course: courseId,
            module: moduleId,
        });

        const course = await Course.findById(courseId);

        if (!course) {
             await Lesson.findByIdAndDelete(lesson._id); 
             return res.status(404).json({ message: 'Curso não encontrado.' });
        }

        const moduleToUpdate = course.modules.id(moduleId); 

        if (!moduleToUpdate) {
            await Lesson.findByIdAndDelete(lesson._id);
            return res.status(404).json({ message: 'Módulo não encontrado neste curso.' });
        }

        moduleToUpdate.lessons.push(lesson._id);
        await course.save();

        res.status(201).json({ 
            message: 'Lição criada e adicionada ao módulo com sucesso!',
            lesson: lesson
        });

    } catch (error) {
        res.status(500).json({ message: 'Erro ao adicionar lição.', error: error.message });
    }
};


// =======================================================
// EXPORTAÇÃO
// =======================================================
module.exports = {
    getCourses,
    getCoursesAdmin,
    createCourse,
    updateCourse,
    deleteCourse,
    addModuleToCourse, 
    addLessonToModule,
    getCourseDetailsForAdmin,
    getCourseDetailsPublic, 
};