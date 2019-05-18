function getLsData(){
    let errorField = document.getElementById("badPin");
    errorField.style.display = "none";
    let pin = document.getElementById("pincode").value;
    let ls =  new Storage.SecureLs({encodingType: 'aes',  encryptionSecret:pin});
    let data;
    try {
        data = ls.get("data");
        console.log(data);
    }catch (e) {
        console.log(e);
        errorField.style.display = "block";
    }
    console.log();
}