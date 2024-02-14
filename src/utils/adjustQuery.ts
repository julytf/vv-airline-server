import { Query } from 'mongoose'

class AdjustQuery {
  query: Query<any, any, any, any, any>
  constructor(query: Query<any, any, any, any, any>) {
    this.query = query
  }
  nameFilter(name: string) {
    this.query.find({ name: { $regex: name, $options: 'i' } })
    return this
  }
  paginate(page = 1, perPage = 10) {
    let skip = (page - 1) * perPage
    this.query.skip(skip).limit(perPage)
    return this
  }
  sort(cri: string) {
    this.query.sort(cri)
    return this
  }
}

export default AdjustQuery
