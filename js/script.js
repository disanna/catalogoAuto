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
                divEditRigaDati.append("<input class='editMarca' type='text' value=" + auto.marca + "></input>");
                divEditRigaDati.append("<input class='editModello' type='text' value=" + auto.modello + "></input>");
                divEditRigaDati.append("<button class='editOk' onclick='update(\"" + id + "\")'>OK</input>");
                divEditRigaDati.append("<button class='editOk' onclick='hideEditAuto(\"" + id + "\")'>Annulla</input>");
                divEditRigaDati.hide();
                divRiga.append(divEditRigaDati);
                var divEditControls = $("<div class='editControls'></div>");
                divEditControls.append("<button onclick='showEditAuto(\"" + id + "\")'>Modifica</button>");
                divEditControls.append("<button onclick='deleteAuto(\"" + id + "\")'>Cancella</button>");
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

function showEditAuto(id) {
		$("#"+id).children("div.rigaDati").hide();
		$("#"+id).children("div.editControls").hide();
    $("#"+id).children("div.editRigaDati").show();
}

function hideEditAuto(id) {
    $("#"+id).children("div.editRigaDati").hide();
		$("#"+id).children("div.rigaDati").show();
		$("#"+id).children("div.editControls").show();
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

function update(id) {
    var marca = $("#"+id + " *").filter(".editMarca").val();
    var modello = $("#"+id + " *").filter(".editModello").val();
    if (marca !== "" && modello !== "") {
        var auto = {marca: marca, modello: modello};
        $.ajax({
            type: "POST",
            dataType: "json",
            url: "http://localhost:3113/update/" + id,
            data: auto
        }).done(function(data) {
            hideEditAuto(id);
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