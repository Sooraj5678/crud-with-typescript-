import { NextFunction, Request, Response } from 'express';
import logging from '../config/logging';
import { Connect, Query } from '../config/mysql';
import jwt from 'jsonwebtoken';

const NAMESPACE = 'Books';
const SECRET_KEY = 'your_jwt_secret_key'; // Ensure you keep this secret and secure

type Row = {
    name: any;
    id: number;
    username: string;
    email: string;
    course: string;
    password: string;
};

const createBook = async (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, 'Inserting ');

    let { name, email, course, password } = req.body;

    let query = `call project.create_book("${name}", "${email}","${course}","${password}")`;

    Connect()
        .then((connection) => {
            Query(connection, query)
                .then((result) => {
                    logging.info(NAMESPACE, 'Book created: ', result);

                    return res.status(200).json({
                        result
                    });
                })
                .catch((error) => {
                    logging.error(NAMESPACE, error.message, error);

                    return res.status(500).json({
                        message: error.message,
                        error
                    });
                })
                .finally(() => {
                    logging.info(NAMESPACE, 'Closing connection.');
                    connection.end();
                });
        })
        .catch((error) => {
            logging.error(NAMESPACE, error.message, error);

            return res.status(500).json({
                message: error.message,
                error
            });
        });
};

const getAllBooks = async (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, 'Getting all books.');
        const page = req.query.page ? parseInt(req.query.page as string) : 1;
        const pageSize = req.query.pageSize ? parseInt(req.query.pageSize as string) : 80;
        const offset = (page - 1) * pageSize;
    let query = `SELECT * FROM users WHERE delete_row = 0 LIMIT ${pageSize} OFFSET ${offset}`;

    Connect()
        .then((connection) => {
            Query(connection, query)
                .then((results) => {
                    logging.info(NAMESPACE, 'Retrieved books: ', results);

                    return res.status(200).json({
                        results
                    });
                })
                .catch((error) => {
                    logging.error(NAMESPACE, error.message, error);

                    return res.status(500).json({
                        message: error.message,
                        error
                    });
                })
                .finally(() => {
                    logging.info(NAMESPACE, 'Closing connection.');
                    connection.end();
                });
        })
        .catch((error) => {
            logging.error(NAMESPACE, error.message, error);

            return res.status(500).json({
                message: error.message,
                error
            });
        });
};

const replaceBook = async (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, 'Replacing book');

    const { id, name, email, course } = req.body;

    if (!id) {
        return res.status(400).json({ message: 'Book ID is required.' });
    }

    const query = `call project.update_table ("${id}",  "${name}",  "${email}" ,"${course}")`;

    try {
        const connection = await Connect();
        const result = await Query(connection, query);
        logging.info(NAMESPACE, 'Book replaced:', result);

        res.status(200).json({ result });
    } catch (error: any) {
        logging.error(NAMESPACE, error.message, error);
        res.status(500).json({ message: error.message, error });
    }
};

const loginBook = async (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, 'Logging in user');

    const { name, password } = req.body;

    if (!name || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    const query = `call project.login_table ("${name}")`;

    try {
        const connection = await Connect();
        const result = await Query(connection, query);

        if (!Array.isArray(result)) {
            throw new Error('Unexpected result format from database');
        }

        const rows: Row[] = result;

        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const user = rows[0];
        if (user.password !== password) {
            return res.status(401).json({ message: 'Incorrect password.' });
        }

        const token = jwt.sign({ id: user.id, name: user.name }, SECRET_KEY, { expiresIn: '1h' });

        logging.info(NAMESPACE, 'User logged in:', user.username);
        res.status(200).json({ token });
    } catch (error: any) {
        logging.error(NAMESPACE, error.message, error);
        res.status(500).json({ message: error.message, error });
    }
};

const deleteBook = async (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, 'Delete data ');

    const { id} = req.body;

    if (!id) {
        return res.status(400).json({ message: ' ID is required.' });
    }

    const query = `call project.delete("${id}")`;

    try {
        const connection = await Connect();
        const result = await Query(connection, query);
        logging.info(NAMESPACE, 'Book replaced:', result);

        res.status(200).json({ result });
    } catch (error: any) {
        logging.error(NAMESPACE, error.message, error);
        res.status(500).json({ message: error.message, error });
    }
};  

const Soft_Delete = async (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, 'Soft_Delete');

    const { id  } = req.body;

    if (!id) {
        return res.status(400).json({ message: 'delete is requiredd.' });
    }

    const query = `call project.soft_delete ("${id}")`;

    try {
        const connection = await Connect();
        const result = await Query(connection, query);
        logging.info(NAMESPACE, 'user soft deleted :', result);

        res.status(200).json({ result });
    } catch (error: any) {
        logging.error(NAMESPACE, error.message, error);
        res.status(500).json({ message: error.message, error });
    }
};

const getDeletedlist = async (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, 'Getting all deleted list.');

    let query = 'SELECT * FROM users WHERE delete_row = 1';

    Connect()
        .then((connection) => {
            Query(connection, query)
                .then((results) => {
                    logging.info(NAMESPACE, 'Retrieved deleted list: ', results);

                    return res.status(200).json({
                        results
                    });
                })
                .catch((error) => {
                    logging.error(NAMESPACE, error.message, error);

                    return res.status(500).json({
                        message: error.message,
                        error
                    });
                })
                .finally(() => {
                    logging.info(NAMESPACE, 'Closing connection.');
                    connection.end();
                });
        })
        .catch((error) => {
            logging.error(NAMESPACE, error.message, error);

            return res.status(500).json({
                message: error.message,
                error
            });
        });
};


export default { replaceBook, createBook, getAllBooks, loginBook, deleteBook, Soft_Delete, getDeletedlist };
