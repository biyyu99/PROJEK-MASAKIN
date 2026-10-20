import bcrypt from 'bcryptjs';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { pool } from '../config/db';
import { AppError } from '../utils/AppError';
import { asyncHandler } from '../utils/asyncHandler';
import { signToken } from '../utils/jwt';
import { loginSchema, registerSchema } from '../validators/auth.validator';

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = registerSchema.parse(req.body);

  const [existing] = await pool.query<RowDataPacket[]>(
    'SELECT id FROM users WHERE email = ?',
    [email],
  );
  if (existing.length > 0) {
    throw new AppError(409, 'Email sudah terdaftar');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const [result] = await pool.query<ResultSetHeader>(
    'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
    [name, email, hashedPassword],
  );

  res.status(201).json({
    message: 'Registrasi berhasil',
    data: {
      user: { id: result.insertId, name, email },
      token: signToken(result.insertId),
    },
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = loginSchema.parse(req.body);

  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT id, name, email, password FROM users WHERE email = ?',
    [email],
  );
  const user = rows[0];

  // Pesan sengaja sama untuk email salah dan password salah,
  // supaya orang tidak bisa menebak email mana yang terdaftar.
  const passwordMatch = user ? await bcrypt.compare(password, user.password) : false;
  if (!user || !passwordMatch) {
    throw new AppError(401, 'Email atau password salah');
  }

  res.json({
    message: 'Login berhasil',
    data: {
      user: { id: user.id, name: user.name, email: user.email },
      token: signToken(user.id),
    },
  });
});
