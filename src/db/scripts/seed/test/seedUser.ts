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
  await admin.setPassword('Password1@')
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
  await staff.setPassword('Password1@')
  staff.save()

  const user1 = new User({
    role: UserRole.USER,
    firstName: 'long',
    lastName: 'tran',
    email: 'longtran@gmail.com',
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
  await user1.setPassword('Password1@')
  user1.save()

  const user2 = new User({
    role: UserRole.USER,
    firstName: 'phung',
    lastName: 'tran',
    email: 'longphung@gmail.com',
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
  await user2.setPassword('Password1@')
  user2.save()

  const array = [
    {
      ho: 'Nguyen',
      ten: 'Anh',
    },
    {
      ho: 'Tran',
      ten: 'Thi Huong',
    },
    {
      ho: 'Le',
      ten: 'Tuan',
    },
    {
      ho: 'Pham',
      ten: 'Thi Lan',
    },
    {
      ho: 'Hoang',
      ten: 'Duc Tri',
    },
    {
      ho: 'Vu',
      ten: 'Ngoc Mai',
    },
    {
      ho: 'Dang',
      ten: 'Quang Huy',
    },
    {
      ho: 'Bui',
      ten: 'Thi Hoa',
    },
    {
      ho: 'Do',
      ten: 'Huu Duy',
    },
    {
      ho: 'Ho',
      ten: 'Thanh Thao',
    },
    {
      ho: 'Ngo',
      ten: 'Minh Tuan',
    },
    {
      ho: 'Duong',
      ten: 'Thi Ngoc',
    },
    {
      ho: 'Ly',
      ten: 'Gia Han',
    },
    {
      ho: 'Phan',
      ten: 'Quoc Huy',
    },
    {
      ho: 'Dinh',
      ten: 'Kim Ngan',
    },
    {
      ho: 'Trinh',
      ten: 'Thi Hong',
    },
    {
      ho: 'Vo',
      ten: 'Van Duc',
    },
    {
      ho: 'Hoang',
      ten: 'Thi Lan',
    },
    {
      ho: 'Nguyen',
      ten: 'Duc Anh',
    },
    {
      ho: 'Le',
      ten: 'Thi Thu',
    },
  ]

  for (let i = 0; i < array.length; i++) {
    const user = new User({
      role: UserRole.USER,
      firstName: array[i].ten,
      lastName: array[i].ho,
      email: `${array[i].ten}${array[i].ho}@gmail.com`.replace(' ', ''),
      phoneNumber: '0909912345',
      dateOfBirth: new Date('2002-01-01'),
    })
    await user.setPassword('Password1@')
    await user.save()
  }
}
