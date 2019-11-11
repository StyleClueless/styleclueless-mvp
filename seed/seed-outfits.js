// Mongo Script

// db = db.getSiblingDB('styleclueless');
const matchingFields = ['inpt', 'outp1', 'outp2', 'out3']
const itemClasses = ['top', 'bottom', 'jacket', 'shoes']
const lookups = matchingFields.map(fieldName => ({
  $lookup: {from: 'taggingData', localField: fieldName, foreignField: 'code', as: `${fieldName}Match`}
}));
db.outfitsTemp.drop();
db.outfits.drop();
db.matchingData.aggregate([...lookups, { $out: 'outfitsTemp' }]);

db.outfitsTemp.find().forEach(doc => {
  const newDoc = matchingFields.reduce((all, fieldName) => {
    const subDoc = doc[fieldName + 'Match'][0];
    all[subDoc['class']] = subDoc.code;
    return all;
  }, { _id: doc._id })
  db.outfitsTemp.save(newDoc)
})

const groupingObject = itemClasses.reduce((all, cls) => {
  all[cls] = { $first: '$' + cls };
  return all;
}, {});

groupingObject._id = itemClasses.reduce((all, cls) => {
  all[cls] = '$' + cls
  return all;
}, {})

db.outfitsTemp.aggregate([
  // {
  //   $group: {
  //     _id: {top: '$top', bottom: '$bottom', jacket: '$jacket', shoes: '$shoes'},
  //     top: {$first: '$top'},
  //     bottom: {$first: '$bottom'},
  //     jacket: {$first: '$jacket'},
  //     shoes: {$first: '$shoes'}
  //   }
  // },
  {
    $group: groupingObject
  },
  {
    $project: {
      _id: 0
    }
  },
  {$out: 'outfits'}
]);

db.outfitsTemp.drop();
