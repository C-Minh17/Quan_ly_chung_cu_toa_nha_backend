import createModel from './base'

const feeTypesSchema = createModel(
    'FeeTypes',
    'feeTypes',
    {
        name:{type:String},
        fee_category:{type:String , enum:['fixed' , 'metered' , 'parking']},
        unit_price:{type:Number},
        unit:{type:String},
        description:{type:String},
        is_active:{type:Boolean,default:true}
    }
)

export default feeTypesSchema