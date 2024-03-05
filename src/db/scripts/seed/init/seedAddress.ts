import Country from '@/models/address/country.model'
import District, { IDistrict } from '@/models/address/district.model'
import Province, { IProvince } from '@/models/address/province.model'
import Ward, { IWard } from '@/models/address/ward.model'
import readJsonFile from '@/utils/readJsonFile'

export default async function seedAddress() {
  const countriesJson = (await readJsonFile('src/db/data/countries.json')) as object[]
  const provincesJson = (await readJsonFile('src/db/data/provinces.json')) as object[]
  const districtsJson = (await readJsonFile('src/db/data/districts.json')) as object[]
  const wardsJson = (await readJsonFile('src/db/data/wards.json')) as object[]

  const wards = await Promise.all(wardsJson.map(async (ward: object) => await Ward.create(ward)))

  const districts = await Promise.all(
    districtsJson.map(
      async (district: object) =>
        await District.create({
          ...district,
          wards: wards.filter((ward: IWard) => ward.districtCode === (district as { code: string }).code),
        }),
    ),
  )

  const provinces = await Promise.all(
    provincesJson.map(
      async (province: object) =>
        await Province.create({
          ...province,
          districts: districts.filter(
            (district: IDistrict) => district.provinceCode === (province as { code: string }).code,
          ),
        }),
    ),
  )

  const countries = await Promise.all(
    countriesJson.map(
      async (country: object) =>
        await Country.create({
          ...country,
          provinces: provinces.filter(
            (province: IProvince) => province.countryCode === (country as { code: string }).code,
          ),
        }),
    ),
  )
}
