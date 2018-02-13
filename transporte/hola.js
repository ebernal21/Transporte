 $("#btnCargarDatos").click(function () {
            var cmbSite = $('#cmbSites').val();
            var cmbMonth = $('#cmbMes').val();
            var rowTables = document.getElementById("rowTables");

            rowTables.style.visibility = "hidden";

            if (cmbSite == "" || cmbMonth == "") {
                swal("Info", "Por favor selecciona un MES y una SUCURSAL", "info");
            }
            else {



                var tbodyCajeros = document.getElementById("tbodyCashiers");
                var thTable = document.getElementById('thTable');
                var tbTable = document.getElementById('tbTable');

                tbodyCajeros.innerHTML = "";
                thTable.innerHTML = "";
                tbTable.innerHTML = "";

                axios.get("http://localhost:60862/Mod/REST/REST02.aspx?site=" + cmbSite + "&month=" + cmbMonth, {
                    dataType: 'json',
                })
                    .then(function (response) {
                        var json = response.data;
                        var status = json.status;
                        if (status == 0) {
                            //llenado tabal cajeros
                            var cashiers = json.cashiers;
                            var tbodyCajeros = document.getElementById("tbodyCashiers");
                            tbodyCajeros.innerHTML = "";
                            for (var i = 0; i < cashiers.length; i++) {
                                var cashier = cashiers[i];
                                var tr = document.createElement("tr");
                                var td = document.createElement("td");
                                td.innerHTML = cashier.id + " - " + cashier.name;
                                td.style.textAlign = "left";
                                td.style.fontWeight = "bold";
                                tr.appendChild(td);
                                tbodyCajeros.appendChild(tr);
                                if ((i + 1) == cashiers.length) {
                                    var tr = document.createElement("tr");
                                    var td = document.createElement("td");
                                    td.innerHTML = "TOTALES";
                                    td.style.textAlign = "center";
                                    td.style.fontWeight = "bold";
                                    tr.appendChild(td);
                                    tbodyCajeros.appendChild(tr);
                                }

                            }

                            //llenado calendario
                            var dateYear = new Date();
                            var year = dateYear.getUTCFullYear();
                            var month = $('#cmbMes').val() - 1;
                            var dateObj = new Date(year, month + 1, 0);
                            var days = dateObj.getDate();
                            var daysArray = ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"];
                            var thTable = document.getElementById('thTable');
                            thTable.innerHTML = "";
                            for (var j = 0; j < 3; j++) {
                                var tr = document.createElement("tr");
                                for (var i = 0; i < days; i++) {
                                    var day = i + 1;
                                    var tblDate = new Date(year, month, day);
                                    switch (j) {
                                        case 0:
                                            var th = document.createElement('th');
                                            th.innerHTML = daysArray[tblDate.getDay()];
                                            th.style.textAlign = "Center";
                                            th.setAttribute('colspan', '3');
                                            tr.appendChild(th);
                                            break;
                                        case 1:
                                            var th = document.createElement('th');
                                            th.innerHTML = day + " / " + (month + 1) + " / " + year;
                                            th.style.textAlign = "Center";
                                            th.setAttribute('colspan', '3');
                                            tr.appendChild(th);
                                            break;
                                        case 2:
                                            var thSobrante = document.createElement('th');
                                            var thFaltante = document.createElement('th');
                                            var thVenta = document.createElement('th');
                                            thSobrante.innerHTML = "Sobrante";
                                            thFaltante.innerHTML = "Faltante";
                                            thVenta.innerHTML = "Venta";
                                            thSobrante.style.textAlign = "Center";
                                            thFaltante.style.textAlign = "Center";
                                            thVenta.style.textAlign = "Center";
                                            tr.appendChild(thSobrante);
                                            tr.appendChild(thFaltante);
                                            tr.appendChild(thVenta);
                                            if ((i + 1) == days) {
                                                var totalSobrante = document.createElement('th');
                                                var totalFaltante = document.createElement('th');
                                                var totalVenta = document.createElement('th');

                                                totalSobrante.innerHTML = "T.Sobrante";
                                                totalFaltante.innerHTML = "T.Faltante";
                                                totalVenta.innerHTML = "T.Venta";

                                                totalSobrante.style.textAlign = "Center";
                                                totalFaltante.style.textAlign = "Center";
                                                totalVenta.style.textAlign = "Center";

                                                tr.appendChild(totalSobrante);
                                                tr.appendChild(totalFaltante);
                                                tr.appendChild(totalVenta);
                                            }
                                            break;
                                    }
                                }


                                thTable.appendChild(tr);
                            }
                            console.log(json);
                            //llenado reporte
                            var tbTable = document.getElementById('tbTable');
                            tbTable.innerHTML = "";
                            for (var i = 0; i < cashiers.length; i++) {
                                var cashier = cashiers[i];
                                var tr = document.createElement('tr');
                                var totalSobrante = 0;
                                var totalFaltante = 0;
                                var totalVenta = 0;
                                for (var j = 0; j < days; j++) {

                                    var thSobrante = document.createElement('td');
                                    var thFaltante = document.createElement('td');
                                    var thVenta = document.createElement('td');

                                    thSobrante.style.textAlign = "center";
                                    thFaltante.style.textAlign = "center";
                                    thVenta.style.textAlign = "center";

                                    thFaltante.innerHTML = " - ";
                                    thSobrante.innerHTML = " - ";
                                    thVenta.innerHTML = " - ";

                                    var transactions = cashier.transactions;

                                    for (var h = 0; h < transactions.length; h++) {
                                        var transaction = transactions[h];

                                        if ((j + 1) == transaction.day) {

                                            if (transaction.type == "NR") {
                                                thSobrante.innerHTML = " - ";
                                                thFaltante.innerHTML = " - ";
                                            }

                                            else if (transaction.type == "DB") {
                                                totalSobrante += transaction.amount;
                                                thSobrante.innerHTML = '$' + transaction.amount.formatMoney(2, '.', ',');
                                                thFaltante.innerHTML = " - ";
                                                thSobrante.style.fontWeight = "bold";
                                                thSobrante.setAttribute('class', 'success');
                                            }

                                            else if (transaction.type == "CR") {
                                                totalFaltante -= transaction.amount;
                                                thSobrante.innerHTML = " - ";
                                                thFaltante.style.fontWeight = "bold";
                                                thFaltante.innerHTML = '$' + transaction.amount.formatMoney(2, '.', ',');
                                                thFaltante.setAttribute('class', 'danger');
                                            }
                                            totalVenta += transaction.sale;

                                            thVenta.setAttribute('class', 'info');
                                            thVenta.style.fontWeight = "bold";
                                            thVenta.innerHTML = "$" + transaction.sale.formatMoney(2, '.', ',');
                                        }
                                    }

                                    tr.appendChild(thSobrante);
                                    tr.appendChild(thFaltante);
                                    tr.appendChild(thVenta);

                                    if ((j + 1) == days) {
                                        var tdSobrante = document.createElement('td');
                                        var tdFaltante = document.createElement('td');
                                        var tdVenta = document.createElement('td');

                                        tdSobrante.innerHTML = "$" + totalSobrante.formatMoney(2, '.', ',');
                                        tdFaltante.innerHTML = "$" + totalFaltante.formatMoney(2, '.', ',');
                                        tdVenta.innerHTML = "$" + totalVenta.formatMoney(2, '.', ',');

                                        tdSobrante.style.textAlign = "Center";
                                        tdFaltante.style.textAlign = "Center";
                                        tdVenta.style.textAlign = "Center";

                                        tdSobrante.style.fontWeight = "bold";
                                        tdFaltante.style.fontWeight = "bold";
                                        tdVenta.style.fontWeight = "bold";

                                        tdSobrante.setAttribute('class', 'success');
                                        tdFaltante.setAttribute('class', 'danger');
                                        tdVenta.setAttribute('class', 'info');

                                        tdSobrante.style.color = "green";
                                        tdFaltante.style.color = "red";
                                        tdVenta.style.color = "blue";

                                        tr.appendChild(tdSobrante);
                                        tr.appendChild(tdFaltante);
                                        tr.appendChild(tdVenta);
                                    }
                                }
                                tbTable.appendChild(tr);

                                //footer
                                if ((i + 1) == cashiers.length) {
                                    var trFooter = document.createElement('tr');
                                    for (var j = 0; j < days; j++) {
                                        var totalSobrante = 0;
                                        var totalFaltante = 0;
                                        var totalVenta = 0;

                                        var thSobrante = document.createElement('td');
                                        var thFaltante = document.createElement('td');
                                        var thVenta = document.createElement('td');

                                        thSobrante.style.textAlign = "center";
                                        thFaltante.style.textAlign = "center";
                                        thVenta.style.textAlign = "center";



                                        thFaltante.innerHTML = " - ";
                                        thSobrante.innerHTML = " - ";
                                        thVenta.innerHTML = " - ";

                                        for (var h = 0; h < cashiers.length; h++) {
                                            var cashier = cashiers[h];
                                            for (var l = 0; l < cashier.transactions.length; l++) {
                                                var transaction = cashier.transactions[l];
                                                if (transaction.day == (j + 1)) {
                                                    if (transaction.type == "DB") {
                                                        totalSobrante += transaction.amount;

                                                    }

                                                    else if (transaction.type == "CR") {
                                                        totalFaltante -= transaction.amount;
                                                    }
                                                    totalVenta += transaction.sale;


                                                }
                                            }
                                        }

                                        if (totalSobrante > 0) {
                                            thSobrante.innerHTML = '$' + totalSobrante.formatMoney(2, '.', ',');
                                            thSobrante.style.color = "green";
                                            thSobrante.style.fontWeight = "bold";
                                            thSobrante.setAttribute('class', 'success');
                                        }
                                        if (totalFaltante > 0) {
                                            thFaltante.innerHTML = '$-' + totalFaltante.formatMoney(2, '.', ',');
                                            thFaltante.style.color = "red";
                                            thFaltante.style.fontWeight = "bold";
                                            thFaltante.setAttribute('class', 'danger');
                                        }
                                        if (totalVenta > 0) {
                                            thVenta.style.color = "blue";
                                            thVenta.innerHTML = "$" + totalVenta.formatMoney(2, '.', ',');
                                            thVenta.style.fontWeight = "bold";
                                            thVenta.setAttribute('class', 'info');
                                        }

                                        trFooter.appendChild(thSobrante);
                                        trFooter.appendChild(thFaltante);
                                        trFooter.appendChild(thVenta);
                                    }
                                    tbTable.appendChild(trFooter);
                                }

                            }


                            rowTables.style.visibility = "visible";
                        }
                        else {
                            swal("Error", json.message , "error");
                        }
                    })
                    .catch(function (error) {
                        console.log(error)
                    })
            }
        });