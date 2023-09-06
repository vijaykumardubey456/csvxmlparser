import React, { useState } from 'react';

const CSVDisplay = ({filedata}) => {
  const [array, setArray] = useState([]);
  const [dublicate, setDublicate] = useState([]);
  const [falsecal, setFalsecal] = useState([]);

  //file reader
  const fileReader = new FileReader();

/**
* breaking down csv string object into array
* @param {array} string
* @return {obj} obj
*/
  const csvFileToArray = string => {
    const csvHeader = string.slice(0, string.indexOf("\n")).split(",");
    var output = csvHeader.map(val => val.replace(/\r$/, ''));
    const csvRows = string.slice(string.indexOf("\n") + 1).split("\n");
 
    const array = csvRows.map(i => {
      const values = i.split(",");
      const obj = output.reduce((object, header, index) => {
        object[header] = values[index];
        return object;
      }, {});
      
      return obj;
    });
    
    let dublicatedValues = findDuplicateReference(array)
    setDublicate(dublicatedValues)

/**
* finding the dublicate account numbers
* @param {array} array
* @return {array} refarray
*/

  function findDuplicateReference(array) {
      let refarray = []
        for(let i = 0; i < array.length;i++) {
          for(let j = 0; j < array.length;j++) {
            if(i !== j) {
                if(array[i].accountNumber === array[j].accountNumber){
                    refarray.push(array[i])
                }
            }
          }
      }
     return refarray
  }

    const uniqueArray = array.filter((obj, index) =>
      array.findIndex((item) => item.accountNumber === obj.accountNumber) === index
    );

/**
* Calculating the transction value
* @param {obj} item
* @return {obj} item
*/

  const calculatValue =  uniqueArray.map((item,index)=>{
      let initialBalance= item.startBalance
      let mutation= item.mutation
      let endBalance= item.endBalance

      let checkbalence = Math.round((parseFloat(initialBalance)
            + parseFloat(mutation)) * 1000) / 1000;
      if((endBalance!=checkbalence)){
        return item
      }
        
    })
    setFalsecal(calculatValue)
    const merged = [...dublicatedValues, ...calculatValue];
    setArray(merged);
  };

/**
* hanndling the data on submit
* @param {event} e
*/

  const handleOnSubmit = (e) => {
    e.preventDefault();

   if (filedata) {
      fileReader.onload = function (event) {
        const text = event.target.result;
        csvFileToArray(text);
      };
      fileReader.readAsText(filedata);
    }
  };

  const headerKeys = Object.keys(Object.assign({}, ...array));
  
  return (
      <div style={{marginRight:167}}>
        <p></p>
        {array ? <p>Click on READ XML to view mis-calculated and duplicate reference ids.</p>:null}
      <form>
        <button
          onClick={(e) => {
            handleOnSubmit(e);
          }}
        >
          IMPORT CSV
        </button>
      </form>   
      <p></p>
      {dublicate ? <p style={{ textAlign: "center" }}>
            Duplicate value List
          </p>: null}
      <table border="1" style={{marginTop:20}}>
        <thead>
       
          <tr key={"header1"}>
            {headerKeys.map((key) => (
              <th>{key}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {dublicate.map((item) => (
            item ? (<tr key={item.id}>
              {Object.values(item).map((val) => (
                <td>{val}</td>
              ))}
          </tr>):( null)
          ))}
        </tbody>
      </table>
      <p></p>
      {falsecal ? <p style={{ textAlign: "center" }}>
            Mis-calculated value List
          </p>: null}

      <table border="1" style={{marginTop:20}}>
        <thead>
          <tr key={"header"}>
            {headerKeys.map((key) => (
              <th>{key}</th>
            ))}
          </tr>
        </thead>
        {falsecal.map((item) => (
            item ? (<tr key={item.id}>
              {Object.values(item).map((val) => (
                <td>{val}</td>
              ))}
          </tr>):( null)
          ))}
      </table>
    </div>
  );
};

export default CSVDisplay;