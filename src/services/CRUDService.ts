import bcrypt from "bcrypt";
import db from "../models";
import User from "../models/user";

const salt = bcrypt.genSaltSync(10);

interface IUserInput {
  id?: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  address?: string;
  phoneNumber?: string;
  gender?: string | boolean;
  roleId?: string;
}

const hashUserPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, salt);
};

const createNewUser = async (data: IUserInput): Promise<string> => {
  try {
    const hashPasswordFromBcrypt = await hashUserPassword(data.password);
    await db.User.create({
      email: data.email,
      password: hashPasswordFromBcrypt,
      firstName: data.firstName,
      lastName: data.lastName,
      address: data.address,
      phoneNumber: data.phoneNumber,
      gender: data.gender === "1" ? true : false,
      roleId: data.roleId,
    });
    return "User created successfully";
  } catch (error) {
    throw error;
  }
};

const getAllUsers = async (): Promise<User[]> => {
  return db.User.findAll({ raw: true });
};

const getUserInfoById = async (userId: number): Promise<User | null> => {
  return db.User.findOne({
    where: { id: userId },
    raw: true,
  });
};

const updateUser = async (data: IUserInput): Promise<User[]> => {
  if (!data.id) {
    throw new Error("User ID is required for update");
  }
  
  const user = await db.User.findOne({ where: { id: data.id } });
  if (!user) throw new Error("User not found");

  user.firstName = data.firstName;
  user.lastName = data.lastName;
  user.address = data.address;
  await user.save();

  return db.User.findAll({ raw: true });
};

const deleteUser = async (userId: number): Promise<string> => {
  const user = await db.User.findOne({ where: { id: userId } });
  if (!user) throw new Error("User not found");

  await user.destroy();
  return "User deleted successfully";
};

export default {
  createNewUser,
  getAllUsers,
  getUserInfoById,
  updateUser,
  deleteUser,
};
