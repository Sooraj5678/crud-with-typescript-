import { NextFunction, Request, Response } from 'express';
import logging from '../config/logging';
import { Connect, Query } from '../config/mysql';
import jwt from 'jsonwebtoken';
import config from '../config/config';

const NAMESPACE = 'Books';
const SECRET_KEY = config.secretKey;

type Row = {
    name: any;
    id: number;
    username: string;
    email: string;

    password: string;
};

const createaccount = async (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, 'Inserting ');

    let { name, email, password } = req.body;

    let checkQuery = `
        SELECT COUNT(*) AS email_count
        FROM admin
        WHERE email = "${email}"
    `;

    Connect()
        .then((connection) => {
            Query(connection, checkQuery)
                .then((checkResult: unknown) => {
                    const resultArray = checkResult as { email_count: number }[];
                    const emailCount = resultArray[0]?.email_count || 0;
                    if (emailCount > 0) {
                        // Email already exists, reject the data
                        logging.info(NAMESPACE, 'Duplicate email detected');
                        return res.status(409).json({
                            message: 'Duplicate email detected'
                        });
                    } else {
                        // Insert the new user if email is not a duplicate
                        let insertQuery = `
                            CALL project.createaccount("${name}", "${email}", "${password}")
                        `;
                        Query(connection, insertQuery)
                            .then((result) => {
                                logging.info(NAMESPACE, 'Account created: ', result);

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
                            });
                    }
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

const getBooks = async (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, 'Getting all books.');

    let query = `SELECT * FROM admin `;

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

const replace = async (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, 'Replacing book');

    const { email, password } = req.body;

 

    const query = `UPDATE admin 
                   SET Password = '${password}'
                   WHERE Email = '${email}'`; ;

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

const login2 = async (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, 'Logging in user');

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    const query = `SELECT * FROM admin WHERE email = '${email}' AND password = '${password}' LIMIT 1`;

    try {
        const connection = await Connect();
        const result = await Query(connection, query);

        // Log the result to inspect what's returned from the database
        logging.info(NAMESPACE, 'Database query result:', result);

        const rows = result as Row[];

        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const user = rows[0];

        // Log the passwords for debugging
        logging.info(NAMESPACE, 'User password from database:', user.password);
        logging.info(NAMESPACE, 'Password sent in request:', password);

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

    const { id } = req.body;

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


const checkEmail = async (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE,'Checking email existence');

    const {email} =req.body;
    let query = `SELECT * FROM admin WHERE email = "${email}"`

    Connect()
    .then((connection)=> {
        Query(connection, query , [email])
        .then ((results) => {
            logging.info(NAMESPACE, 'Email check results: ', results);
             if ((results as any[]).length > 0) {
                        return res.status(200).json({ exists: true });
                    } else {
                        return res.status(200).json({ exists: false });
                    }
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
    


    



export default { replace, createaccount, getBooks, login2, deleteBook, checkEmail };
