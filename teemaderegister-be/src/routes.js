
const express = require('express')
const router = express.Router()
const { jwtEnsure, allowRoles } = require('./utils/jwt')
const validate = require('./utils/validate')
const asyncMiddleware = require('./utils/asyncMiddleware')
const multerMiddleware = require('./utils/multerMiddleware')
const { ADMIN, SUPERVISOR } = require('./constants/roles')
const csv = require('./controllers/csv')
const auth = require('./controllers/auth')
const curriculums = require('./controllers/curriculums')
const search = require('./controllers/search')
const supervisors = require('./controllers/supervisors')
const topics = require('./controllers/topics')
const users = require('./controllers/users')
const admin = require('./controllers/admin')
const tos = require('./controllers/tos')
const factor = require('./controllers/factor')

router.get('/csv', asyncMiddleware(csv.findCsvData))
router.post('/auth/local/login', validate.localLogin, asyncMiddleware(auth.localLogin))
router.post('/auth/local/signup', validate.localSignup, asyncMiddleware(auth.localSignup))
router.post('/auth/logout', jwtEnsure, asyncMiddleware(auth.logout))
router.post('/auth/forgot', validate.passwordResetEmail, asyncMiddleware(auth.forgotPassword))
router.get('/auth/reset/:token', asyncMiddleware(auth.validatePasswordResetToken))
router.post('/auth/reset/:token', validate.passwordResetMatch, asyncMiddleware(auth.updatePassword))

router.get('/curriculums/', asyncMiddleware(curriculums.getCurriculums))
router.get('/curriculums/:slug', asyncMiddleware(curriculums.getCurriculumBySlug))
router.post('/curriculums', jwtEnsure, allowRoles([ADMIN]), validate.addCurriculumValidation, asyncMiddleware(curriculums.postCurriculums))

router.get('/search/counts', asyncMiddleware(search.getCounts))

router.get('/supervisors/', asyncMiddleware(supervisors.getSupervisors))
router.get('/supervisors/curriculumForm/', asyncMiddleware(supervisors.getSupervisorsCurriculumForm))
router.get('/supervisors/:slug', asyncMiddleware(supervisors.getSupervisorBySlug))

router.get('/topics/', asyncMiddleware(topics.getTopics))
router.post('/topics/supervisor', jwtEnsure, allowRoles([SUPERVISOR, ADMIN]), asyncMiddleware(topics.getSupervisorTopics))
router.post('/topics/', jwtEnsure, allowRoles([SUPERVISOR, ADMIN]), asyncMiddleware(topics.createTopic))

router.get('/users/me', jwtEnsure, asyncMiddleware(users.getUser))
router.get('/users/profile', jwtEnsure, asyncMiddleware(users.getProfile))
router.put('/users/profile', jwtEnsure, validate.userAccountUpdate, asyncMiddleware(users.updateUser))
router.put('/users/password', jwtEnsure, validate.userPasswordUpdate, asyncMiddleware(users.updatePassword))
router.post('/users/upload-picture', jwtEnsure, multerMiddleware('profileImage'), asyncMiddleware(users.uploadPicture))

router.post('/auth/local/factor', jwtEnsure, asyncMiddleware(factor.create))
router.post('/auth/local/factor/enable', jwtEnsure, asyncMiddleware(factor.enable))
router.post('/auth/local/factor/disable', jwtEnsure, asyncMiddleware(factor.disable))
router.get('/auth/local/factor', jwtEnsure, asyncMiddleware(factor.get))
router.post('/auth/local/factor/insert', jwtEnsure, asyncMiddleware(factor.insert))
router.get('/auth/emailconfirm/:token', asyncMiddleware(auth.emailVerification))

router.put('/users/reset-picture', jwtEnsure, asyncMiddleware(users.resetPicture))

router.get('/admin/', jwtEnsure, allowRoles([ADMIN]), asyncMiddleware(admin.getSecret))
router.post('/admin/topics', jwtEnsure, allowRoles([ADMIN, SUPERVISOR]), asyncMiddleware(admin.getSupervisorTopics))
router.post('/admin/createUser', jwtEnsure, allowRoles([ADMIN]), asyncMiddleware(admin.createUser))
router.get('/admin/users', jwtEnsure, allowRoles([ADMIN]), asyncMiddleware(users.getAllUsers))
router.post('/admin/tos/save', jwtEnsure, allowRoles([ADMIN]), asyncMiddleware(tos.saveTos))
router.get('/tos', asyncMiddleware(tos.getTos))

router.get('/admin/curriculums', jwtEnsure, allowRoles([ADMIN]), asyncMiddleware(admin.getCurriculums))
router.put('/admin/curriculums', jwtEnsure, allowRoles([ADMIN]), asyncMiddleware(admin.putCurriculums))
router.get('/admin/user/ids', jwtEnsure, allowRoles([ADMIN]), asyncMiddleware(admin.getUserData))

module.exports = router