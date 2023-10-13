import { Router } from 'express';

import { CreateUserController } from '@modules/users/services/createUser/CreateUserController';
import { ShowUserController } from '@modules/users/services/showUser/ShowUserController';
import { ListUserController } from '@modules/users/services/listUser/ListUserController';
import { UpdateUserController } from '@modules/users/services/updateUser/UpdateUserController';
import { DeleteUserController } from '@modules/users/services/deleteUser/DeleteUserController';
import { AuthenticateUserController } from '@modules/users/services/authenticateUser/AuthenticateUserController';
import { ResetPasswordController } from '@modules/users/services/resetPassword/ResetPasswordController';
import { SendForgotPasswordEmailController } from '@modules/users/services/sendForgotPasswordEmail/SendForgotPasswordEmailController';
import { ShowSelfUserController } from '@modules/users/services/showSelfUser/ShowSelfUserController';

const userRouter = Router();
const listUserController = new ListUserController();
const showUserController = new ShowUserController();
const updateUserController = new UpdateUserController();
const deleteUserController = new DeleteUserController();
const authenticateUserController = new AuthenticateUserController();
const resetPasswordController = new ResetPasswordController();
const showSelfUserController = new ShowSelfUserController();
const createUserController = new CreateUserController();
const sendForgotPasswordEmailController =
  new SendForgotPasswordEmailController();

userRouter.post('/login', authenticateUserController.handle);
userRouter.post('/register', createUserController.handle);
userRouter.get('/me', showSelfUserController.handle);
userRouter.get('/users', listUserController.handle);
userRouter.get('/users/:id', showUserController.handle);
userRouter.put('/users/:id', updateUserController.handle);
userRouter.post('/password-forgot', sendForgotPasswordEmailController.handle);
userRouter.post('/password-reset', resetPasswordController.handle);
userRouter.delete('/users/:id', deleteUserController.handle);

export { userRouter };
