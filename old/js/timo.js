var request = new XMLHttpRequest();
var token = "";
var fileName = "";
var fileType = "";
var fileContent = "";
var fileUpload = "";
var tiketNumber = "";
var userName_afterLogin = "";
var userEmail_afterLogin = "";
var product = "TIMO";
var timoURL = "https://uat.timo.global";
var botServiceHealthURL = "https://chat-pybridge-qa.exela.global/v2/health";

$(document).ready(async function () {
  console.log("executed");

  $(".open-button").click(function () {
    // alert('srcipt started')
    console.log("clicked");
    $("#masterDiv").load(
      `${window.location.href}/timo.html`,
      async function (response, status, xhr) {
        if (status == "error") {
          var msg = "Sorry but there was an error: ";
          $("#error").html(msg + xhr.status + " " + xhr.statusText);
        } else {
          console.log($("#userName").val() + "----" + $("#userEmail").val());
          if ($("#userName").val() != "") {
            userName_afterLogin = $("#userName").val();
            // $("#createdBy").attr("disabled", true);
          } else {
            userName_afterLogin = $("#userName").val();
          }
          if ($("#userEmail").val() != "") {
            userEmail_afterLogin = $("#userEmail").val();
            // $("#requestorEmail").attr("disabled", true);
          } else {
            userEmail_afterLogin = $("#userEmail").val();
          }
          //if(userName_afterLogin != ''){
          $("#createdBy").val(userName_afterLogin);
          //$("#requestorEmail").val(userEmail_afterLogin);
          // $("#createdBy").attr('disabled',true);
          //$("#requestorEmail").attr('disabled',true);
          // }
          // if(userEmail_afterLogin != ''){
          //$("#createdBy").val(userName_afterLogin);
          $("#requestorEmail").val(userEmail_afterLogin);
          // $("#createdBy").attr('disabled',true);
          //  $("#requestorEmail").attr('disabled',true);
          // }
          // var modal = document.getElementById("timoSupport");
          // modal.style.display = "block";
          // var isBotServiceOK = await checkBotServiceHealth(botServiceHealthURL);
          document.getElementById("overlay").style.display = "block";

          $(".open-button").hide();
          // if (!isBotServiceOK) {
          //   $("#supportSwitch").click();
          //   $("#botSwitch").hide();
          // }

          return false;
        }
      },
    );

    $("body").addClass("bacscrollStop");

    return false;
  });
  return false;
});

async function checkBotServiceHealth(serviceURL) {
  try {
    const status = (await fetch(serviceURL)).status;
    console.log("service status", status);
    return status == 200;
  } catch (err) {
    return false;
  }
}

function saveContactSupport() {
  product = $("#productName").val();
  token = "TXbdSOGFXWrwfcgZbIWNrZHnmdOLRZkau9wDLOrZD7hSMojxcgYk4X7+61Qiutk=";
  var data = {
    product: product,
    customer: "Exela Technologies",
    created_by: document.getElementById("createdBy").value,
    type: "Issue",
    priority: "4",
    shortDescription: document.getElementById("shortDescription").value,
    fullDescription: document.getElementById("fullDescription").value,
    requestorEmail:
      document.getElementById("requestorEmail").value == ""
        ? "kaushlesh.singh@exelaonline.com"
        : document.getElementById("requestorEmail").value,
  };

  //console.log("final data ==>", data);
  var xhrNew = request.open(
    "POST",
    `${timoURL}/Ticket_Management_Service/Create_Ticket`,
    true,
  );
  request.setRequestHeader("Authorization", "Bearer " + token);
  request.setRequestHeader("Content-Type", "application/json");

  request.send(JSON.stringify(data));

  request.onload = function () {
    if (request.status != 200) {
      //alert(`Error ${request.status}: ${request.statusText}`); // e.g. 404: Not Found
      $("#timoSupport").hide();
      $("#resultDiv").show();
      $("#errorDiv").show();
      $("#msg").html = "Error while creating ticket";
    } else {
      // show the result
      var result = JSON.parse(request.response);
      tiketNumber = result.callNumber;
      errMsg = result.errorMsg;
      //alert(tiketNumber)
      if (tiketNumber == null) {
        $("#timoSupport").hide();
        $("#resultDiv").show();
        $("#errorDiv").show();
        $("#msg").html = errMsg;
        return false;
      }
      if (result.callNumber != null && fileName != "") {
        request.open(
          "POST",
          `${timoURL}/Ticket_Management_Service/Create_Attachment`,
          true,
        );
        var fileUpload = {
          callNumber: result.callNumber,
          fileType: fileType,
          fileName: fileName,
          attachment: fileContent,
        };

        request.setRequestHeader("Authorization", "Bearer " + token);
        request.setRequestHeader("Content-Type", "application/json");

        request.send(JSON.stringify(fileUpload));
        request.onload = function () {
          if (request.status != 200) {
            $("#timoSupport").hide();
            $("#resultDiv").show();
            $("#errorDiv").show();
            $("#msg").html = "Error in attaching file";
            //alert(`Error file upload ${request.status}: ${request.statusText}`);
          } else {
            if (tiketNumber == null) {
              $("#timoSupport").hide();
              $("#resultDiv").show();
              $("#errorDiv").show();
              $("#msg").html = errMsg;
              return false;
            }
            console.log("response", request.response);
            // document.getElementById("timoSupport").style.display = 'none';
            document.getElementById("contactSupportForm").style.display =
              "none";
            $("#botSwitch").hide();
            document.getElementById("resultDiv").style.display = "block";
            document.getElementById("successDiv").style.display = "block";
            console.log(" =tiketNumber =", tiketNumber);
            document.getElementById("refrenceNumber").innerHTML =
              "<strong>" + tiketNumber + "</strong>";
          }
        };
      }
      if (fileName == "") {
        // document.getElementById("timoSupport").style.display = 'none';
        document.getElementById("contactSupportForm").style.display = "none";
        $("#botSwitch").hide();
        document.getElementById("resultDiv").style.display = "block";
        document.getElementById("successDiv").style.display = "block";
        console.log(" =tiketNumber =", tiketNumber);
        document.getElementById("refrenceNumber").innerHTML =
          "<strong>" + tiketNumber + "</strong>";
      } else {
        console.log("I Have not got file");
      }
    }
  };

  request.onerror = function () {
    document.getElementById("timoSupport").style.display = "none";
    document.getElementById("errorDiv").style.display = "block";
    document.getElementById("msg").innerHTML =
      "Something went wrong with connectivity.";
    return false;
  };
}

function resetForm() {
  $("#timoSupport").show();
  $("#resultDiv").hide();
  $("#errorDiv").hide();
  $("#msg").html = "";
  $("#contactSupportSubmit").removeClass("disabledBtn");
  $("body").removeClass("bacscrollStop");
}

function previewFile() {
  const preview = document.querySelector("img");
  const file = document.querySelector("input[type=file]").files[0];
  const reader = new FileReader();

  reader.addEventListener(
    "load",
    function () {
      // convert image file to base64 string
      fileContent = reader.result.split(",")[1];
    },
    false,
  );

  if (file) {
    reader.readAsDataURL(file);

    fileType = file.type;
    fileName = file.name;
  }
}

/* function validation(){
   var isValid =[];
    if(document.getElementById('createdBy').value == '' || document.getElementById('createdBy').value == null){
      isValid.push('createdBy')
      
    }
    if(document.getElementById('shortDescription').value == '' || document.getElementById('shortDescription').value == null){
      isValid.push('shortDescription')
      
    }
    if(document.getElementById('shortDescription').value == '' || document.getElementById('shortDescription').value == null){
      isValid.push('shortDescription')
      
    }
    if(isValid.length > 0){
      return false
    }else{
      return true;
    }
//      document.getElementById('createdBy').isValid

} */

// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
  "use strict";
  window.addEventListener(
    "submit",
    function () {
      // Fetch all the forms we want to apply custom Bootstrap validation styles to
      var forms = document.getElementsByClassName("needs-validation");
      // Loop over them and prevent submission
      var validation = Array.prototype.filter.call(forms, function (form) {
        form.addEventListener(
          "submit",
          function (event) {
            if (form.checkValidity() === false) {
              event.preventDefault();
              event.stopPropagation();
            } else {
              //call save
              console.log(" success");

              // setTimeout(function(){ alert("Hello"); }, 3000)
            }
            form.classList.add("was-validated");
            console.log("fail");
          },
          false,
        );
      });
    },
    true,
  );
})();
