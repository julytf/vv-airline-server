import config from '@/config'
import Country from '@/models/address/country.model'
import District from '@/models/address/district.model'
import Province from '@/models/address/province.model'
import Ward from '@/models/address/ward.model'
import User from '@/models/user.model'
import { Request, Response, NextFunction } from 'express'
import Stripe from 'stripe'

export default {
  getCountries: async (req: Request, res: Response, next: NextFunction) => {
    const countries = await Country.find({})

    return res.json({
      status: 'success',
      data: countries,
    })
  },

  getProvinces: async (req: Request, res: Response, next: NextFunction) => {
    const countryCode = req.query.countryCode
    const searchQuery = countryCode !== undefined ? { countryCode } : {}
    const provinces = await Province.find(searchQuery)

    return res.json({
      status: 'success',
      data: provinces,
    })
  },

  getDistricts: async (req: Request, res: Response, next: NextFunction) => {
    const provinceCode = req.query.provinceCode
    const searchQuery = provinceCode !== undefined ? { provinceCode } : {}
    const districts = await District.find(searchQuery)

    console.log('provinceCode', provinceCode)
    console.log('searchQuery', searchQuery)

    return res.json({
      status: 'success',
      data: districts,
    })
  },

  getWards: async (req: Request, res: Response, next: NextFunction) => {
    const districtCode = req.query.districtCode
    const searchQuery = districtCode !== undefined ? { districtCode } : {}
    const wards = await Ward.find(searchQuery)

    return res.json({
      status: 'success',
      data: wards,
    })
  },
}
