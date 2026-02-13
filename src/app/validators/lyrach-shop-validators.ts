import {FormControl, ValidationErrors} from "@angular/forms";

export class LyrachShopValidators {

  static notOnlyWhitespace(control:FormControl):ValidationErrors|null{

    //chech if string only contains whitespaces

    if(control.value!=null&&(control.value.trim().length===0)){
      //invalid .... Return error object

      return {'notOnlyWhitespace':true}
    }else{
      //valid return null
      return null;
    }
  }
}
