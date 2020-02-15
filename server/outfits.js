import { db } from './mongo-connection'
import util from 'util'


export const getOutfitsBySKU = async skuCode => {
  const itemsColl = db.collection('taggingData')
  const outfitsColl = db.collection('outfits')

  const itemCursor = itemsColl.find({
    code: skuCode
  })
  const itemFetcher = util.promisify(
    itemCursor.toArray.bind(itemCursor)
  )
  const items = await itemFetcher()

  const outfitsCursor = outfitsColl.find({
    [items[0]['class']]: skuCode
  })
  const outfitsFetcher = util.promisify(
    outfitsCursor.toArray.bind(outfitsCursor)
  )

  return await outfitsFetcher()
}
