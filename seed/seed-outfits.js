// Mongo Script

// db = db.getSiblingDB('styleclueless');
// const matchingFields = ['inpt', 'outp1', 'outp2', 'out3']
// const itemClasses = ['top', 'bottom', 'jacket', 'shoes']
// const lookups = matchingFields.map(fieldName => ({
//   $lookup: {from: 'taggingData', localField: fieldName, foreignField: 'code', as: `${fieldName}Match`}
// }));
// db.outfitsTemp.drop();
// db.outfits.drop();
// db.matchingData.aggregate([...lookups, { $out: 'outfitsTemp' }]);
//
// db.outfitsTemp.find().forEach(doc => {
//   const newDoc = matchingFields.reduce((all, fieldName) => {
//     const subDoc = doc[fieldName + 'Match'][0];
//     all[subDoc['class']] = subDoc.code;
//     return all;
//   }, { _id: doc._id })
//   db.outfitsTemp.save(newDoc)
// })

// const sample
// const sampleItem = db.taggingData.findOne();
//
// const itemFields = Object.keys(sampleItem).slice(1);

// db.taggingData.aggregate([
//   {
//     $project: itemFields.reduce((all, field) => {
//       all[field] = {
//         $concat: [`$${field}`]
//       }
//       return all
//     }, {})
//   },
//   { $out: 'taggingDataTemp'}
// ]);
//
// db.taggingDataTemp.renameCollection('taggingData', true);

db.taggingData.find().forEach(doc => {
  Object.keys(doc).slice(1).forEach(key => {
      // doc[key] = doc[key].toString().match(/\d+/g).map(Number)[0];
      // doc[key] = doc[key].toString();
      let string_value=doc[key] = doc[key].toString();
      if(string_value.indexOf("Num")!==-1){
          doc[key] = string_value.match(/\d+/g).map(Number)[0];
      }
      else{
          doc[key] =  string_value;
      }
  });

  db.taggingData.save(doc);
});

const sampleOutfit = db.outfitsTemp.findOne();

const outfitClasses = Object.keys(sampleOutfit).slice(1)

const groupingObject = outfitClasses.reduce((all, cls) => {
  all[cls] = { $first: '$' + cls };
  return all;
}, {});

groupingObject._id = outfitClasses.reduce((all, cls) => {
  all[cls] = '$' + cls;
  return all;
}, {});

const removeNACondMaker = fieldName => ({
  $cond: {
    if: { $eq: [ "NA", `$${fieldName}` ] },
    then: "$$REMOVE",
    else: `$${fieldName}`
  }
});

db.outfitsTemp.aggregate([
  {
    $group: groupingObject
  },
  {
    $project: {
      _id: 0
    }
  },
  {
    $project: outfitClasses.reduce((all, iClass) => {
      all[iClass] = removeNACondMaker(iClass)
      return all
    }, {})
  },
  {$out: 'outfits'}
]);

db.outfitsTemp.drop();

db.outfits.find().forEach(doc => {
  Object.keys(doc).slice(1).forEach(key => {
    // doc[key] = doc[key].toString();
      let string_value=doc[key] = doc[key].toString();
      if(string_value.indexOf("Num")!==-1){
          doc[key] = string_value.match(/\d+/g).map(Number)[0];
      }
      else{
          doc[key] =  string_value;
      }


  });
  db.outfits.save(doc);
});

