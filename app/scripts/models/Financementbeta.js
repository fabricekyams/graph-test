define([
	'scripts/app',
	'DocteurCreditJS',
	'scripts/models/DBRead.js'
	], function (app,DC) {
	app.factory('Financement', function (DBRead , $http){

		function Financement(capital, rate, duration, date){

			
			this.capital = capital;

			this.rate = rate;
			this.initRate = this.rate;

			this.duration = duration;
			
			this.date = date;
			this.dateString = date.toLocaleDateString();
			
			this.monthlyPayment = 0;
			this.variation = {};
			this.cap = {pos:6,neg:6};
			this.refInd = [];
			this.refInd[0] =  {};
			this.refInd[0].val =  2.9;
			this.refInd[0].rate =  rate;
			this.refInd[0].date =  date.toLocaleDateString();

			this.amortization = [];
			this.story = 'max';
			this.type = 'fixe';
			//this.generateRateTable();
			this.update();
		}

		Financement.prototype = {
			/* body... */

			update: function () {
				this.date = new Date(this.formatDate(this.dateString));
				this.rate = Math.round((Math.pow(1 + (this.initRate/100), 1 / 12) - 1)*1000000)/1000000;
				this.setMonthlyPayment();

				if(this.type.localeCompare('fixe') == 0 ){
					this.variation = {};
					this.setAmortization();
				}else{
					this.setVariation();
					this.getRefTableStart();
					if(this.variation.fixe>= this.duration){
						this.setAmortization();
						this.refInd = this.refInd.slice(0,1);
					}else{
						this.setAmortizationWithVariation();
					}
				}

			},
			setDuration : function (argument) {
				this.duration = Math.floor(DC.CreditUtil.calculDuree(this.rate, this.monthlyPayment/this.capital));
			},
			setMonthlyPayment : function(){
				this.monthlyPayment = DC.CreditUtil.calculMensualite(this.rate, this.duration)*this.capital;
			},

			setAmortization : function () {
				this.amortization=[];
				//this.setRefIndData(0,this.rate);
				this.initArmortizationVal(0,this.duration, this.duration, this.capital, this.rate);
				this.totalPayment = this.amortization[this.duration-1].totalPayment;
				this.totalInterest = this.amortization[this.duration-1].totalInterest;
				this.totalCapital = this.totalPayment - this.totalInterest;
			},
			setAmortizationWithVariation : function () {
				//this.initRefTable();
				//console.log(this.story);
				this.amortization=[];
				this.setMax();
				this.initArmortizationVal(0,this.variation.fixe,this.duration, this.capital, this.rate);
				//this.setRefIndData(0,this.rate);
				//this.refInd = this.refInd.slice(0,1);
				//this.setIndexationRate();
				switch(this.story){
					case 'max':
						this.calculIndexationMax();
						break;
					case 'min':
						this.calculIndexationMin();
						break;
					case 'same':
						this.calculIndexationSame();
						break;
					case 'limit':
						this.calculIndexionLimite();
						break;
					case 'costum':
						this.calculIndexionCostum(this.rate);
						break;
					default:
						this.calculIndexationMax();
						break;
				}
				var rate;
				var j = 1;
				for (var i = this.variation.fixe; i < this.duration; i=i+this.variation.reval) {
					var durationLeft = this.duration - i;
					//console.log(this.refInd);
					if(this.story.localeCompare('costum')==0 || this.refInd[j].dateList.length>1){
						//console.log(this.refInd[j].val);
						if (this.refInd[j].dateList.length>1) {
							var k = 0;
							console.log(this.refInd[j]);

							while(this.refInd[j].dateList[k].date.localeCompare(this.refInd[j].date)){
								k++;
							}
							this.refInd[j].val = this.refTab[k][this.variation.type];
						};
						this.rate = this.indexation(this.refInd[j].val);
						//console.log(DC.CreditUtil.tauxPeriodiqueToAn(this.rate,1)*100);
					}
					if (this.variation.fixe == 12  && i<= this.variation.fixe+24 && this.rate > DC.CreditUtil.tauxAnToPeriodique(this.initRate/100,1)) {
						switch(i){
							case this.variation.fixe:
								var one =  this.calculIndexionAdd(DC.CreditUtil.tauxAnToPeriodique(1/100,1));
								rate = one < this.rate ? (one): this.rate;
								//console.log(i/12);
									if (this.story.localeCompare('costum')!=0) {
										this.refInd[i/12].val = this.round(this.calculInRef(rate)); 
									};
								break;
							case this.variation.fixe+12:
								//console.log(i/12);
								var two =  this.calculIndexionAdd(DC.CreditUtil.tauxAnToPeriodique(2/100,1));
								rate = two < this.rate ? (two) : this.rate;
									if (this.story.localeCompare('costum')!=0) {
										this.refInd[i/12].val = this.round(this.calculInRef(rate));
									};
								break;
							case this.variation.fixe+24:
								//console.log(i/12);
								var three =  this.calculIndexionAdd(DC.CreditUtil.tauxAnToPeriodique(3/100,1));
								rate = three < this.rate ? (three) : this.rate;
									if (this.story.localeCompare('costum')!=0) {
										this.refInd[i/12].val = this.round(this.calculInRef(rate));
									};
							default:
								rate = this.rate;
								break;
						}
					}else{
						rate = this.rate;
					};
					this.setRefIndData(j,rate);
					if(this.duration - i == this.duration%this.variation.reval){
						this.initArmortizationVal(i,this.duration, durationLeft, this.amortization[i-1].SRD, rate);
					}else{
						this.initArmortizationVal(i,this.variation.reval+i,durationLeft, this.amortization[i-1].SRD, rate);
					}
					j++;
				};
				this.totalPayment = this.amortization[this.duration-1].totalPayment;
				this.totalInterest = this.amortization[this.duration-1].totalInterest;
				this.totalCapital = this.totalPayment - this.totalInterest;
			},
			initArmortizationVal : function (position, len, durationLeft, capital, rate){
				var period = 1;
				for (var i = position; i < len; i++) {
					this.amortization[i]={};
					this.amortization[i].month='mois: '+(i+1);
					this.amortization[i].dateTerme=this.getDateTerme(i+1);
					this.amortization[i].rate=DC.CreditUtil.tauxPeriodiqueToAn(rate,1)*100;
					this.amortization[i].monthlyPayment=DC.CreditUtil.calculMensualite(rate, durationLeft)*capital;
					this.amortization[i].SRD=DC.CreditUtil.calculCapital(rate, durationLeft, period)*capital;
					this.amortization[i].interest=this.getInterest(period,durationLeft,capital,rate);
					this.amortization[i].capital=this.amortization[i].monthlyPayment - this.amortization[i].interest;
					this.amortization[i].totalPayment=this.getTotalPayment(i);
					this.amortization[i].totalInterest=this.getTotalInterest(i);
					period++;

				};
				//console.log(this.amortization);
			},
			getYearsAmortization : function(){
				return 'ok';
			},
			getInterest : function (periode, duration, capital,rate) {

					return rate*(DC.CreditUtil.calculCapital(rate, duration, periode-1)*capital);

			},
			getCapital : function (periode) {
					return this.monthlyPayment - this.getInterest(periode);
			},
			getDateTerme : function (periode) {
				var date = new Date(this.date.getTime());
				date.setMonth(date.getMonth()+periode);
				return date.toLocaleDateString();

			},
			getTotalInterest: function (periode) {
				var totInterest;
				if(periode>0){
					totInterest = this.amortization[periode-1].totalInterest+this.amortization[periode].interest;
				}else{
					totInterest = this.amortization[0].interest
				}
				return totInterest;
			},
			getTotalPayment: function (periode) {
				var totPayment;
				if(periode>0){
					totPayment = this.amortization[periode-1].totalPayment+this.amortization[periode].interest+this.amortization[periode].capital;
				}else{
					totPayment = this.amortization[0].interest+this.amortization[0].capital;
				}
				return totPayment;
			},
			round : function (argument) {
				// round à la 5eme decimal
			},
			formatDate : function (date) {
				date.replace('/[-]gi/', '/');
				var datetab = date.split('/');
				var i = datetab[0];
				datetab[0]= datetab[1];
				datetab[1]=i;
				return datetab.join("/");

			},
			getTotalInterestFromPeriode : function (duration) {
				var periode = this.duration - duration;
				var total=0;
				for(var i=periode; i<this.amortization.length ; i++){
					total += this.amortization[i].interest;
				}

				return total;
			},
			getTotalCapitalFromPeriode : function (duration) {
				var periode = this.duration - duration;
				var total=0;
				for(var i=periode; i<this.amortization.length ; i++){
					total += this.amortization[i].capital;
				}
				return total;
			},
			getTotalFromPeriode : function  (duration) {
				var periode = this.duration - duration;
				var total=0;
				for(var i=periode; i<this.amortization.length ; i++){
					total += this.amortization[i].interest+this.amortization[i].capital;
				}
				return total;
			},
			setVariation: function (argument) {
				var temp = this.type.split("/");
				this.variation = { 'fixe':temp[0]*12, 'reval':temp[1]*12};
				switch(temp[1]){
					case '1':
						this.variation.type = 'A';
						break;
					case '3':
						this.variation.type = 'C';
						break;
					case '5':
						this.variation.type = 'E';
						break;
				}
			},
			calculIndexationMax : function (argument) {
				this.refInd = this.refInd.slice(0,1);
				this.rate =  DC.CreditUtil.tauxAnToPeriodique(this.initRate/100,1)+this.maxInd;
				this.calculIndexionCostum(this.rate);
				 
			},
			calculIndexationMin : function (argument) {
				this.refInd = this.refInd.slice(0,1);
				this.rate =  DC.CreditUtil.tauxAnToPeriodique(this.initRate/100,1)-this.minInd;
				this.calculIndexionCostum(this.rate);
			},
			calculIndexationSame : function (){
				this.refInd = this.refInd.slice(0,1);
				this.refInd[this.refInd.length] = {};
				this.refInd[this.refInd.length-1].val = this.refInd[0].val;
				var tmp =  DC.CreditUtil.tauxAnToPeriodique(this.refInd[this.refInd.length-1].val/100,1) - DC.CreditUtil.tauxAnToPeriodique(this.refInd[0].val/100,1);
				var ind;
				if (tmp<0) {
					ind = this.max(Math.abs(tmp),this.minInd);
					ind = 0-ind;
				}else{
					ind = this.max(Math.abs(tmp),this.maxInd);
					ind = ind;
				};
				this.rate =  DC.CreditUtil.tauxAnToPeriodique(this.initRate/100,1) + ind; 
				this.calculIndexionCostum(this.rate);

			},
			calculIndexionLimite : function (){
				console.log('a ton avis?');
				this.story = 'costum';
				this.calculIndexationSame();
				var ind = Math.floor(this.refInd[0].val - this.refInd[0].rate);
				var rank = 1;
				this.findLimite(ind, rank);
				this.story = 'limit';

			},
			findLimite : function (indice , rank) {
				console.log(indice);
				console.log(rank);
				if (this.indiceAdvantageous(indice+rank)  && indice+rank < this.maxIndice) {
					this.findLimite(indice+rank, rank);
				}else{
					console.log('indice: ',indice);
					if (rank>0.001) {
						this.findLimite(indice,rank/10);
					}else{
						for (var i = 1; i < this.refInd.length; i++) {
							this.refInd[i].val=indice;
						}	
					}
				}
				this.update();
			},
			indiceAdvantageous : function (indice) {
				var advantageous = false;
				for (var i = 1; i < this.refInd.length; i++) {
					this.refInd[i].val=indice;
				};
				this.update();
				if (this.totalPaymentInitMortgage>this.totalPayment) {
					console.log(this.totalPaymentInitMortgage+' est plus grand que '+this.totalPayment+'?');
					advantageous = true;
				};
				console.log(advantageous);
				return advantageous;
			},

			calculIndexionCostum : function (rate){
				var offset = 0;
				var start;
				if(this.startDatePosition>0){
					offset = this.refTab.length - this.startDatePosition;
				}

				var rest = this.duration - this.variation.fixe;
				var len = Math.ceil(offset/this.variation.reval);
				len += Math.ceil(rest/this.variation.reval);
				
				if(len+1 < this.refInd.length){
					this.refInd = this.refInd.slice(0,len+1);
				}else{
					var deb = this.refInd.length;
					position = this.startDatePosition;
					//console.log(deb);
					for (var i = deb; i < len+1 ; i++) {
						position = this.startDatePosition + (i-1)*this.variation.reval;
						this.refInd[i] = {};
						this.refInd[i].dateList = [];
						if (position<this.refTab.length) {
							this.refInd[i].val = this.refTab[position][this.variation.type];
							for (var j = 0; j < 3; j++) {
								//this.refInd[i][j] = {};
								this.refInd[i].dateList[j] = {};
								this.refInd[i].dateList[j].date = this.refTab[position].date.toLocaleDateString();
								this.refInd[i].dateList[j].position = position;
								//this.refInd[i][j].val = this.refTab[position][this.variation.type];
								//this.refInd[i][j].rate = this.initRate;
								position--;
							};
							this.refInd[i].date = this.refInd[i].dateList[0];
							position = this.startDatePosition + (i)*this.variation.reval;
						}else{
								//this.refInd[i][0] = {};
								this.refInd[i].dateList[0] = {};
								this.refInd[i].dateList[0].date = this.getDateTerme(this.variation.fixe+(this.variation.reval*(i-1)));
								this.refInd[i].dateList[0].position = -1;
								this.refInd[i].val = this.round(this.calculInRef(rate));
								//this.refInd[i][0].rate = this.initRate;
								//start--;
							
						};

						//console.log(rate);
						//this.refInd[i] = [];
						//this.refInd[i].val = this.round(this.calculInRef(rate));
						//console.log(this.variation.fixe+(this.variation.reval*(i-1)));
						//this.refInd[i].date = this.getDateTerme(this.variation.fixe+(this.variation.reval*(i-1)));
					};
				}


			},
			setRefIndData : function (period,rate) {
				//if (period==0) {
				//	this.refInd[period].date = this.date.toLocaleDateString();
				//}else{
					//this.refInd[period].date = this.getDateTerme(this.variation.fixe+(this.variation.reval*(period-1)));
				///}
				//console.log(rate);
				 this.refInd[period].rate = this.round(DC.CreditUtil.tauxPeriodiqueToAn(rate,1)*100);
			},
			calculIndexionAdd : function (rateToAdd) {
				return DC.CreditUtil.tauxAnToPeriodique(this.initRate/100,1)+rateToAdd;
			},
			setMax : function (argument) {
				this.maxInd = this.max(DC.CreditUtil.tauxAnToPeriodique(this.initRate/100,1),DC.CreditUtil.tauxAnToPeriodique(this.cap.pos/100,1));
				this.minInd = this.max(DC.CreditUtil.tauxAnToPeriodique(this.initRate/100,1),DC.CreditUtil.tauxAnToPeriodique(this.cap.neg/100,1));
				this.maxIndice =  this.calculInRef(this.maxInd + DC.CreditUtil.tauxAnToPeriodique(this.initRate/100,1));
			},
			max : function (a,b) {
				return a<b ? a : b;
			},
			setIndRefList : function () {
				
			},
			calculInRef : function (rate) {
				var indRef = rate - DC.CreditUtil.tauxAnToPeriodique(this.initRate/100,1) + DC.CreditUtil.tauxAnToPeriodique(this.refInd[0].val/100,1);
				//console.log(DC.CreditUtil.tauxPeriodiqueToAn(indRef,1)*100);
				return DC.CreditUtil.tauxPeriodiqueToAn(indRef,1)*100;
			},
			indexation : function  (refInd) {
				var indexation = DC.CreditUtil.tauxAnToPeriodique(refInd/100,1) - DC.CreditUtil.tauxAnToPeriodique(this.refInd[0].val/100,1);
				//console.log('indexation1:', DC.CreditUtil.tauxPeriodiqueToAn(indexation,1)*100);
				if (indexation<0) {
					indexation = Math.abs(indexation) < this.minInd ? indexation :( 0 - this.minInd);
				}else{
					indexation = indexation < this.minInd ? indexation : this.minInd;
				};
				//console.log('indexation2:', DC.CreditUtil.tauxPeriodiqueToAn(indexation,1)*100);
				return DC.CreditUtil.tauxAnToPeriodique(this.initRate/100,1) + indexation;
			},
			setCap : function (argument) {
				var split = this.type.split(' ');
				var splitCap= split[1].split('/');
				this.cap.pos = parseInt(splitCap[0].replace(/[\(\)\+]/g, ''))
				this.cap.neg = parseInt(splitCap[0].replace(/[\(\)\-]/g, ''))
			},
			round : function (val) {
				return Math.round(val*1000)/1000;
			},
			setRefTab : function (tab) {
				this.refTab = [];
				for (var i = 0; i < tab.length; i++) {
					this.refTab[i] = {};
					this.refTab[i].date = new Date(tab[i].date);
					this.refTab[i].A = this.round(parseFloat(tab[i].A));
					this.refTab[i].C = this.round(parseFloat(tab[i].C));
					this.refTab[i].E = this.round(parseFloat(tab[i].E));
				};
				console.log(this.refTab);
			},
			getRefTableStart : function (argument) {
				var today = new Date();
				var start = 0;
				var offset = this.getMonthDifference(this.date, today);
				offset += 1; 
				var start = this.refTab.length - offset;
				//this.refInd = [];
				this.refInd[0].dateList = [];
				this.refInd[0].val = this.refTab[start][this.variation.type];
				for (var i = 0; i < 3; i++) {
					//this.refInd[0][i] = {};
					this.refInd[0].dateList[i] ={};
					this.refInd[0].dateList[i].date = this.refTab[start].date.toLocaleDateString();
					this.refInd[0].dateList[i].position = start;
					//this.refInd[0][i].val = this.refTab[start][this.variation.type];
					//this.refInd[0][i].rate = this.initRate;
					start--;
				};
				this.refInd[0].date = this.refInd[0].dateList[0].date;
				
				start = this.refTab.length;
				offset = offset - this.variation.fixe;
				if (offset>0) {
					start = this.refTab.length - offset;
				};
				this.startDatePosition = start;
				console.log(this.refInd);
			},
			getMonthDifference : function (date, dateTwo){
				var month = (dateTwo.getFullYear() - date.getFullYear())*12;
				month-= (date.getMonth() - dateTwo.getMonth());
				return month;
			},
			initRefTable : function (argument) {

			}



		};

		return Financement;

	});
});
