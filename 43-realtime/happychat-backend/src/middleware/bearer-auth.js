import * as jwt from 'jsonwebtoken'
import Account from '../model/account.js'
import createError from 'http-errors'
import promisify  from '../lib/promisify.js'

export default (req, res, next) => {
  let {authorization} = req.headers
  if(!authorization)
    return next(createError(400, 'AUTH ERROR: no authorization header'))

  let token = authorization.split('Bearer ')[1]
  if(!token)
    return next(createError(400, 'AUTH ERROR: not bearer auth'))

  promisify(jwt.verify)(token, process.env.SECRET)
  .then(({tokenSeed}) => Account.findOne({tokenSeed}))
  .then((user) => {
    if(!user)
      throw createError(401, 'AUTH ERROR: user not found')
    req.user = user
    next()
  })
  .catch(err => createError(401, err))
}
