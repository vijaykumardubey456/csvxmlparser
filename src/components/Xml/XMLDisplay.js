import React, { useState } from 'react';
import xmlparser from "react-xml-parser";


const XMLDisplay = ({filedata}) => {
  const [referenceId, setreferenceId] = useState([]);
  const [dublicateId, setDublicateId] = useState([]);
  const [falsecalId, setFalsecalId] = useState([]);
 

  const loadaccountnumber = xml => {
    let dublicateRef = findDuplicateReference(xml)
    setDublicateId(dublicateRef)
    let  falseCalculatedValue = calculatValue(xml)
    setFalsecalId(falseCalculatedValue)

    let finalref = [...dublicateRef,...falseCalculatedValue]
    let dublicateRefRemoveds = [...new Set(finalref)]
    
    setreferenceId(dublicateRefRemoveds)
  };

/**
* finding the dublicate account numbers
* @param {array} array
* @return {array} refarray
*/

  function findDuplicateReference(xmlobj) {
  let refarray = []
    for(let i = 0; i < xmlobj.length;i++) {
      for(let j = 0; j < xmlobj.length;j++) {
        if(i !== j) {
            if(xmlobj[i].children[0].value === xmlobj[j].children[0].value){
                refarray.push(xmlobj[i].attributes.reference)
            }
        }
      }
  }
 let dublicateRemoveds = [...new Set(refarray)]
 return dublicateRemoveds
}

/**
* Calculating the transction value
* @param {obj} item
* @return {obj} item
*/

  function calculatValue(xml) {
    const numberArray =  xml.map((item,index)=>{
      let startBalance = item.children[2].value
      let mutation = item.children[3].value
      let endBalance = item.children[4].value

      let checkbalence = Math.round((parseFloat(startBalance)
      + parseFloat(mutation)) * 1000) / 1000;
        if((endBalance!=checkbalence)){
          return item.attributes.reference
        }
        return ''
    })
    const noEmptyStrings = numberArray.filter((str) => str !== '');
    return noEmptyStrings;
  }
  
/**
* hanndling the data on submit
* @param {event} e
*/

   const handleOnSubmit = (e) => {
     e.preventDefault();
     const reader = new FileReader();
      reader.readAsText(filedata);
          reader.onloadend = e => {
          const readerdata = e.target.result;
          let xmld = new xmlparser().parseFromString(readerdata);    // Assume xmlText contains the example XML
          loadaccountnumber(xmld.children)
        }
     }

  return (
    <div style={{marginRight:167}}>
      <p></p>
      <div>
       <form>
         <button
           onClick={(e) => {
             handleOnSubmit(e);
           }}
         >
           Read XML
         </button>
       </form>
       
       </div>
       {dublicateId ? <p>List of reference Ids having dublicate transcactions</p>:null}

      <table  border="1" style={{ marginLeft:196}}>
        <tbody>
          {dublicateId.map((item,index) => (
            item ? (<tr key={index}>
                <td>{item}</td>
          </tr>):( null)
          ))}
        </tbody>
      </table>
      <p></p>

      {falsecalId ? <p>List of reference Ids having mis-calculated value</p>:null}
      <table  border="1" style={{ marginLeft:196}}>
        <tbody>
          {falsecalId.map((item,index) => (
            item ? (<tr key={index}>
                <td>{item}</td>
          </tr>):( null)
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default XMLDisplay;