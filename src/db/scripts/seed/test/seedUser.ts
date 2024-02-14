import { UserGender, UserRole } from '@/enums/user.enums'
import District from '@/models/address/district.model'
import Province from '@/models/address/province.model'
import Ward from '@/models/address/ward.model'
import User from '@/models/user.model'

export default async function seedUser() {
  const admin = new User({
    role: UserRole.ADMIN,
    firstName: 'Vũ',
    lastName: 'Lâm',
    email: 'vulam@vvairline.com',
    phoneNumber: '0909912345',
    dateOfBirth: new Date('2002-01-01'),
    gender: UserGender.MALE,
    address: {
      address: 'dia chi nha',
      address2: 'so tang, toa nha',
      ward: await Ward.findOne({ codeName: 'cau_ke' }),
      district: await District.findOne({ codeName: 'cau_ke' }),
      province: await Province.findOne({ codeName: 'tra_vinh' }),
    },
  })
  await admin.setPassword('password')
  admin.save()

  const staff = new User({
    role: UserRole.STAFF,
    firstName: 'Hổ',
    lastName: 'Bạch',
    email: 'bachho@vvairline.com',
    phoneNumber: '0909912346',
    dateOfBirth: new Date('2002-01-01'),
    gender: UserGender.MALE,
    address: {
      address: 'dia chi nha',
      address2: 'so tang, toa nha',
      ward: await Ward.findOne({ codeName: 'cau_ke' }),
      district: await District.findOne({ codeName: 'cau_ke' }),
      province: await Province.findOne({ codeName: 'tra_vinh' }),
    },
  })
  await staff.setPassword('password')
  staff.save()

  const user1 = new User({
    role: UserRole.ADMIN,
    firstName: 'long',
    lastName: 'tran',
    email: 'longtran@google.com',
    phoneNumber: '0909911111',
    dateOfBirth: new Date('2000-01-01'),
    gender: UserGender.MALE,
    address: {
      address: 'dia chi nha',
      address2: 'so tang, toa nha',
      ward: await Ward.findOne({ codeName: 'cau_ke' }),
      district: await District.findOne({ codeName: 'cau_ke' }),
      province: await Province.findOne({ codeName: 'tra_vinh' }),
    },
  })
  await user1.setPassword('password')
  user1.save()

  const user2 = new User({
    role: UserRole.ADMIN,
    firstName: 'phung',
    lastName: 'tran',
    email: 'longphung@google.com',
    phoneNumber: '0909922222',
    dateOfBirth: new Date('2000-01-01'),
    gender: UserGender.FEMALE,
    address: {
      address: 'dia chi nha',
      address2: 'so tang, toa nha',
      ward: await Ward.findOne({ codeName: 'cau_ke' }),
      district: await District.findOne({ codeName: 'cau_ke' }),
      province: await Province.findOne({ codeName: 'tra_vinh' }),
    },
  })
  await user2.setPassword('password')
  user2.save()
}
