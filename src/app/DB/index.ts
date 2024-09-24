import config from '../config';
import { User } from '../modules/user/user.model';

const superUser = {
  id: '0001',
  password: config.super_admin_password,
  email: 'marufhosenbscse@gmail.com',
  role: 'superAdmin',
  status: 'in-progress',
  isDeleted: false,
};
const superAdmin = async () => {
  const isSuperAdminExists = await User.findOne({ role: 'superAdmin' });

  if (!isSuperAdminExists) {
    await User.create(superUser);
  }
};

export default superAdmin;
