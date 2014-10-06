/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var idSelectedAuto;

function ricerca() {
    $("#risultato").html("");
    $(function() {
        $.ajax({
            type: "GET",
            url: "http://localhost:3113/ricerca",
            dataType: "json",
            data: {q: $('#testoRicerca').val()}
        }).done(function(data) {
            elencoAuto = data;
            elencoAuto.forEach(function(auto) {
                var id = auto._id;
                var divRiga = $("<div></div>", {
                            "id": id,
                            "class": "riga"
                        });
                var divRigaDati = $("<div class='rigaDati'></div>");
                divRigaDati.append("<span class='cella'>" + auto.marca + "</span>");
                divRigaDati.append("<span class='cella'>" + auto.modello + "</span>");
                divRiga.append(divRigaDati);
                var divEditRigaDati = $("<div class='editRigaDati'></div>");
                divEditRigaDati.append("<input class='editMarca' type='text'>" + auto.marca + "</input>");
                divEditRigaDati.append("<input class='editModello' type='text'>" + auto.modello + "</input>");
                divEditRigaDati.append("<button class='editOk'>OK</input>");
                divEditRigaDati.append("<button class='editOk'>Annulla</input>");
                divEditRigaDati.hide();
                divRiga.append(divEditRigaDati);
                var divEditControls = $("<div class='editControls'></div>");
                divEditControls.append("<button onclick='enableUpdate(\"" + id + "\")'>Update</button>");
                divEditControls.append("<button onclick='deleteAuto(\"" + id + "\")'>Delete</button>");
                divEditControls.hide();
                divRiga.append(divEditControls);
                divRiga.mouseover(function() {divEditControls.show();});
                divRiga.mouseout(function() {divEditControls.hide();});
                divRiga.appendTo("#risultato");
            });
        }).fail(function(jqXHR, textStatus) {
            myLog(textStatus);
        });
    });
}

function enableUpdate(id) {
    $.ajax({
        type: "GET",
        url: "http://localhost:3113/ricerca/" + id,
        dataType: "json"
    }).done(function(auto) {
        idSelectedAuto = id;
        $("#"+id).children("div.rigaDati").hide();
        $("#"+id).children("div.editRigaDati").show();
        $("#marcaUpdate").val(auto.marca);
        $("#modelloUpdate").val(auto.modello);
        $("#updateBtn").show();
        $("#annullaBtn").show();
    }).fail(function(jqXHR, textStatus) {
        myLog(textStatus);
    });
}

function deleteAuto(id) {
    $.ajax({
        type: "GET",
        url: "http://localhost:3113/delete/" + id,
        dataType: "json"
    }).done(function(auto) {
        $("#"+id).remove();
    }).fail(function(jqXHR, textStatus) {
        myLog(textStatus);
    });
}

function disableUpdate(id) {
    $("#updateBtn").hide();
    $("#annullaBtn").hide();
    $("#marcaUpdate").val("");
    $("#modelloUpdate").val("");
    $("#"+id).children("div.rigaDati").show();
    $("#"+id).children("div.EditRigaDati").hide();
    idSelectedAuto = "";
}

function update(id) {
    var marca = $("#"+id).children("input.editMarca").val();
    var modello = $("#"+id).children("input.editModello").val();
    if (marca !== "" && modello !== "") {
        var auto = {marca: marca, modello: modello};
        $.ajax({
            type: "POST",
            dataType: "json",
            url: "http://localhost:3113/update/" + idSelectedAuto,
            data: auto
        }).done(function(data) {
            disableUpdate(id);
            ricerca();
        }).fail(function(jqXHR, textStatus) {
            myLog(textStatus);
        });
    }
}

function inserisci() {
    var marca = $('#marca').val();
    var modello = $('#modello').val();
    if (marca !== "" && modello !== "") {
        var auto = {marca: marca, modello: modello};
        $.ajax({
            type: "POST",
            dataType: "json",
            url: "http://localhost:3113/inserisci",
            data: auto
        }).done(function(data) {
            myLog("result= " + data + "; inserito auto= " + auto.marca + ", " + auto.modello);
            ricerca();
        }).fail(function(jqXHR, textStatus) {
            myLog(textStatus);
        });
    }
}

function myLog(testo) {
    $("#statusBar").append(testo + "</br>");
}

$.ready(function() {
    idSelectedAuto = "";
    $("#updateBtn").hide();
    $("#annullaBtn").hide();
});