import express from 'express';
import controller from '../controllers/book';
import controller1 from '../controllers/book1'
const router = express.Router();

router.post('/login/books', controller.loginBook);
router.post('/delete/book', controller.deleteBook);

router.post('/soft/book', controller. Soft_Delete);
router.get('/deletelist/books', controller.getDeletedlist);

router.post('/replace/books', controller.replaceBook);
router.post('/create/books', controller.createBook);
router.get('/get/books', controller.getAllBooks);


// second login

router.post('/createaccount/books', controller1.createaccount);
router.get('/getbhai/books', controller1.getBooks);
router.post('/checkemail/book', controller1.checkEmail);
router.post('/login2/book', controller1.login2);
router.post('/forget/books', controller1.replace);

export = router;
