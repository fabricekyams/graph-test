define([
	'scripts/app',
	'DocteurCreditJS',
	'scripts/models/Financementbeta.js'
	], function (app,DC) {
		app.factory('Refinancing', function (Financement){
		/**
		 * [Refinancing description]
		 * @param {[type]} capital   [description]
		 * @param {[type]} rate      [description]
		 * @param {[type]} duration  [description]
		 * @param {[type]} date      [description]
		 * @param {[type]} newDate   [description]
		 * @param {[type]} newRate   [description]
		 * @param {[type]} rateTable [description]
		 */
		 function Refinancing(capital, rate, duration, date, newDate, newRate, rateTable){
		 	this.initMortgage = new Financement(capital, rate, duration, date);
		 	this.rate = rate;
		 	this.date = date;
		 	this.newDate = newDate;
		 	this.knowSRD = 'no';
		 	this.externalRef = false;
		 	this.duration = duration;
		 	this.init(this.rate);
		 	this.fileCharges = 330;
		 	this.fraisNotaire = 400;
		 	this.releaseCharges = 0;
		 	this.MGRegistration = 0;
		 	this.refMortgage = new Financement(this.capital, newRate, this.durationLeft, newDate);
		 	this.refMortgage.rateTable = [];
		 	this.generateRateTable(rateTable);
		 	this.generateTypeTable(rateTable);
		 	this.refMortgage.rateTable[0]=newRate;
		 	this.initMortgage.totalPaymentIfRef = this.initMortgage.getTotalFromPeriode(this.durationLeft);
		 	this.initMortgage.totalCapitalIfRef = this.initMortgage.getTotalCapitalFromPeriode(this.durationLeft);
		 	this.initMortgage.totalInterestIfRef = this.initMortgage.getTotalInterestFromPeriode(this.durationLeft);
		 	this.refMortgage.totalPaymentInitMortgage = this.initMortgage.totalPaymentIfRef;
		 	this.update(false, true, true);



		 }

		 Refinancing.prototype = {

			/**
			 * [update description]
			 * @param  {[type]} ref           [description]
			 * @param  {[type]} duration      [description]
			 * @param  {[type]} durationFirst [description]
			 * @return {[type]}               [description]
			 */
			 update: function (ref,  duration, durationFirst) {

			 	this.durationLeft = this.getDurationLeft(this.date, new Date(this.refMortgage.formatDate(this.refMortgage.dateString)));
			 	this.initMortgage.durationLeft = this.durationLeft;

			 	if (!ref) {
			 		this.initMortgage.update();
			 		if ( this.initMortgage.type.localeCompare('fixe')!==0) {
			 			console.log('limit', this.initMortgage.refInd.length - this.initMortgage.getRefIndLength());
			 			this.initMortgage.monthlyPayment=this.initMortgage.refInd[this.initMortgage.refInd.length - this.initMortgage.getRefIndLength()-1].monthlyPayment;
			 		};

			 	};
			 	this.date = this.initMortgage.date;
			 	this.newDate = new Date(this.refMortgage.formatDate(this.refMortgage.dateString));
			 	this.init(this.initMortgage.initRate);
			 	this.refMortgage.capital = this.capital;
			 	this.refMortgage.newRefInd = this.refMortgage.refInd;
			 	if(!duration){
			 		this.refMortgage.duration = this.durationLeft;
			 	}
			 	this.refMortgage.durationLeft = this.refMortgage.duration;

			 	this.validateData(durationFirst);

			 	this.updateStory();
			 	this.initMortgage.totalPaymentIfRef = this.initMortgage.getTotalFromPeriode(this.durationLeft);
			 	this.initMortgage.totalCapitalIfRef = this.initMortgage.getTotalCapitalFromPeriode(this.durationLeft);
			 	this.initMortgage.totalInterestIfRef = this.initMortgage.getTotalInterestFromPeriode(this.durationLeft);
			 	this.refMortgage.totalPaymentInitMortgage = this.initMortgage.totalPaymentIfRef;
			 	this.getResultsCase();
			 },

			 updateStory : function(argument) {
			 	if(this.refMortgage.type.localeCompare('fixe')!==0 && this.initMortgage.type.localeCompare('fixe')!==0){
			 		if(this.refMortgage.variation.type.localeCompare(this.initMortgage.variation.type)==0){
			 			if(this.initMortgage.story.localeCompare(this.refMortgage.story)!==0){
			 				var len = this.initMortgage.getRefIndLength();

			 				if (this.refMortgage.story.localeCompare('costum')==0) {
			 					if(len>1){
			 						var initStart = this.initMortgage.refInd.length - this.initMortgage.getRefIndLength();
			 						var startPosition = this.findDate(this.initMortgage.refInd[initStart].date.date, this.refMortgage.refInd, 1);
			 						for (var i = 1; i < this.refMortgage.refInd.length; i++) {
			 							this.refMortgage.refInd[i].val = this.initMortgage.refInd[this.initMortgage.refInd.length-1].val;
			 						};
			 					}
			 					this.refMortgage.update();

			 				}else{
			 					if (this.refMortgage.refInd.length>1) {
			 						if (this.initMortgage.refInd.length-len>0) {
			 							var initStart = this.initMortgage.refInd.length - this.initMortgage.getRefIndLength();
			 							var startPosition = this.findDate(this.refMortgage.refInd[1].date.date, this.initMortgage.refInd, initStart);
			 							for (var i = startPosition; i < this.initMortgage.refInd.length; i++) {
			 								this.initMortgage.refInd[i].val = this.refMortgage.refInd[this.refMortgage.refInd.length-1].val;
			 							};
			 						};
			 					};
			 					this.initMortgage.update();
			 				}
			 			}

			 		}
			 	}
			 },

			/**
			 * [init description]
			 * @return {[type]} [description]
			 */
			 init : function (rate) {
			 	this.releaseCharges =0;
			 	this.MGRegistration =0;
			 	this.durationLeft = this.getDurationLeft(this.date, this.newDate);
			 	this.SRD = this.getSRD();
			 	this.indem = this.getIndem(rate);
			 	this.capital = this.indem+this.SRD+this.fileCharges;
			 	if(this.externalRef){
			 		var fraisCredit = DC.FraisCreditFactory.getFraisCredit(1);
			 		this.releaseCharges = DC.FraisMainLevee.getFraisMainLevee(this.SRD);
			 		this.capital+=this.releaseCharges;

			 		var capital = fraisCredit.getMontantBrut(this.capital);
			 		this.MGRegistration = capital - this.capital + this.fraisNotaire;
			 		this.FraisDivers = this.MGRegistration - this.fraisNotaire;
			 		this.capital = capital + this.fraisNotaire;
			 	}else{
			 		this.releaseCharges = 0;
			 		this.MGRegistration = 0;
			 	}
			 	this.totalFrais = this.fileCharges+this.MGRegistration+this.releaseCharges+this.indem
			 },
			 minimizeThenUpdate : function  (argument) {
				// body...
			},
			maximizeThenUpdate : function  (argument) {
				// body...
			},
			adjust : function (ref) {
				var len = this.initMortgage.getRefIndLength();
				var start = this.initMortgage.refInd.length-len;
				if(this.refMortgage.type.localeCompare('fixe')!==0 && this.initMortgage.type.localeCompare('fixe')!==0){
					if(this.refMortgage.variation.type.localeCompare(this.initMortgage.variation.type)==0){
						if(ref){
							if (start>0) {
								var refpos=1;
								var i = start;
								var ended = false;
								while(i < this.initMortgage.refInd.length && !ended) {
									var found = false;
									while(!found && refpos<this.refMortgage.refInd.length){
										var dater = this.refMortgage.refInd[refpos].date.date.split('/');
										var monthr = dater[1];
										var yearsr = dater[2];

										var date = this.initMortgage.refInd[i].date.date.split('/');
										var month = date[1];
										var years = date[2];
										if(monthr == month && years == yearsr){
											found = true;
											this.initMortgage.refInd[i].val=this.refMortgage.refInd[refpos].val;
										}
										refpos++;
										ended = refpos == this.refMortgage.refInd.length ? true : false;
									};
									if(refpos == this.refMortgage.refInd.length && !found){
										refpos=1;
										ended = false;
									}
									i++;
								}

							};
							
							//...
						}else{
							if (start>0) {
								var initpos=start;
								var i = 1;
								var ended = false;
								while(i < this.refMortgage.refInd.length && !ended) {
									var found = false;
									while(!found && initpos<this.initMortgage.refInd.length){
										var dater = this.refMortgage.refInd[i].date.date.split('/');
										var monthr = dater[1];
										var yearsr = dater[2];

										var date = this.initMortgage.refInd[initpos].date.date.split('/');
										var month = date[1];
										var years = date[2];
										if(monthr == month && years == yearsr){
											found = true;
											this.refMortgage.refInd[i].val=this.initMortgage.refInd[initpos].val;
										}
										initpos++;
										ended = initpos == this.initMortgage.refInd.length ? true : false;
									};
									if(initpos == this.initMortgage.refInd.length && !found){
										initpos=start;
										ended = false;
									}
									i++;
								}

							};

							//...
						}
					}
				}
			},

			limitThenUpdate : function (ref) {
				this.initMortgage.story = 'costum';
				this.refMortgage.story = 'costum';


				var minInd = 0;
				var maxInd = 0;
				var startPosition;

				if(ref){
					if(this.refMortgage.type.localeCompare('fixe')!==0){
						minInd = this.refMortgage.getIndiceMin() ;
						maxInd = this.refMortgage.getIndiceMax();
						if (this.initMortgage.type.localeCompare('fixe')!==0 
							&& this.initMortgage.variation.type.localeCompare(this.refMortgage.variation.type)==0
							) {
							this.reset(ref, true);

						minInd = this.initMortgage.getIndiceMin() < minInd ? this.initMortgage.getIndiceMin() : minInd;
						maxInd = this.initMortgage.getIndiceMax() > maxInd ? this.initMortgage.getIndiceMax() : maxInd;
						var initStart = this.initMortgage.refInd.length - this.initMortgage.getRefIndLength();
						startPosition = this.findDate(this.refMortgage.refInd[1].date.date, this.initMortgage.refInd, initStart);

					}
				}

			}

			if(!ref){
				if(this.initMortgage.type.localeCompare('fixe')!==0){
					if (this.refMortgage.type.localeCompare('fixe')!==0 
						&& this.refMortgage.variation.type.localeCompare(this.initMortgage.variation.type)==0
						) {
						minInd = this.initMortgage.getIndiceMin() < minInd ? this.initMortgage.getIndiceMin() : minInd;
					maxInd = this.initMortgage.getIndiceMax() > maxInd ? this.initMortgage.getIndiceMax() : maxInd;
					var initStart = this.initMortgage.refInd.length - this.initMortgage.getRefIndLength();
					startPosition = this.findDate(this.initMortgage.refInd[initStart].date.date, this.refMortgage.refInd, 1);

					this.reset(ref, true);

				}else{
					minInd = this.initMortgage.getIndiceMin() ;
					maxInd = this.initMortgage.getIndiceMax();
				};	
			}
		}


		var toAdd = maxInd - minInd;
		var maxOK = false;
		var minOK = false;
		this.refIndMax = [];
		maxInd = Math.ceil(maxInd*1000)/1000
		minInd = Math.floor(minInd*1000)/1000

		this.setAllToRefVal(startPosition, ref, minInd);
		var minDiff = this.getDifference();
		if (this.getDifference()>0) {
			minOK = true;
		};

		this.setAllToRefVal(startPosition, ref, maxInd);
		var maxDiff = this.getDifference();
		if (this.getDifference()>0) {
			maxOK = true;
		};

		if(maxOK && !minOK){
			this.setAllToRefVal(startPosition, ref, minInd);
			this.findLimitAsc( startPosition, ref,  minInd, toAdd, 100);
		}else{
			if(!maxOK && minOK){
				this.setAllToRefVal(startPosition, ref, maxInd);
				toAdd = 0 - toAdd;
				this.findLimitAsc( startPosition, ref, maxInd, toAdd, 100);
			}else{
						//this.setAllToRefVal(startPosition, ref, maxInd);
						if (maxOK && minOK) {
							this.findLimitExtremums(startPosition, ref, minInd, maxInd);
							if (this.refIndMax.length==0) {
								if(minDiff<maxDiff){
									this.setAllToRefVal(startPosition, ref, minInd);
								}else{
									this.setAllToRefVal(startPosition, ref, maxInd);
								}
							};
						}else{
							if(minDiff>maxDiff){
								this.setAllToRefVal(startPosition, ref, minInd);
							}else{
								this.setAllToRefVal(startPosition, ref, maxInd);
							}
						}
					}
					
				}




			},

			findLimitAsc : function (startPosition, ref, start, toAdd,  hit) {
				console.log('hit', hit);
				console.log('start ', start);
				console.log('toAdd ', toAdd);
				toAdd = this.round(toAdd);
				start = this.round(start);
				console.log('toAdd ', toAdd);

				this.setAllToRefVal(startPosition, ref, start+toAdd);

				if(hit>0 && (this.getDifference()>10 || this.getDifference()<0)){
					hit-=1;
					if (this.getDifference()>0 ) {
						this.findLimitAsc( startPosition, ref, start, toAdd/2, hit);
					}else{
						this.findLimitAsc( startPosition, ref,  start+toAdd, toAdd/2,  hit);
					};
				}else{
					if (this.getDifference()<10) {
						this.refIndMax[this.refIndMax.length] = start+toAdd - this.refMortgage.refInd[0].val;
					};
				}


			},

			findLimitExtremums :  function (startPosition, ref, floor, ceil) {
				
				var maxl = 0;
				var minl = 0;
				var maxr = 0;
				var minr = 0;
				var foundl = false;
				var foundr = false;
				var i = floor+1; 
				var j=ceil-1;
				
				while(i<ceil && !foundl){
					this.setAllToRefVal(startPosition, ref, i);
					if (this.getDifference()<0){
						foundl= true;
						minl = i-1;
						maxl = i;
					}
					i++;
				}

				while(j>floor && !foundr){
					this.setAllToRefVal(startPosition, ref, j);
					if (this.getDifference()<0){
						foundr = true;
						minr = j;
						maxr = j+1;
					}
					j--;
				}


				if(foundl){
					var toAdd = minl-maxl;
					this.findLimitAsc( startPosition, ref, maxl, toAdd, 100);

				}

				if(foundr){
					var toAdd = maxr-minr;
					this.findLimitAsc( startPosition, ref, minr, toAdd, 100);
				}


			},

			setAllToRefVal : function  (start, ref, val) {
				if (ref) {
					for (var i = 1; i < this.refMortgage.refInd.length; i++) {
						this.refMortgage.refInd[i].val = val;
					};

					if (this.initMortgage.type.localeCompare('fixe')!==0 
						&& this.initMortgage.variation.type.localeCompare(this.refMortgage.variation.type)==0) {
						if (start>0 && this.initMortgage.refInd.length>start) {
							for (var i = start; i < this.initMortgage.refInd.length; i++) {
								this.initMortgage.refInd[i].val = val;
							};
						}
					};
				};


				if(!ref){
					var initStart = this.initMortgage.refInd.length - this.initMortgage.getRefIndLength();
					for (var i = initStart; i < this.initMortgage.refInd.length; i++) {
						this.initMortgage.refInd[i].val = val;
					};
					if (this.refMortgage.type.localeCompare('fixe')!==0 
						&& this.refMortgage.variation.type.localeCompare(this.initMortgage.variation.type)==0) {
						if (start>0 && this.refMortgage.refInd.length>start) {
							for (var i = start; i < this.refMortgage.refInd.length; i++) {
								this.refMortgage.refInd[i].val = val;
							};
						};
					};

				}
				
				this.update(false, true, true);
			},

			reset : function (ref, all) {

				var startPosition = 1;
				if (!all) {
					if (ref) {
						if (this.initMortgage.type.localeCompare('fixe')!==0 
							&& this.initMortgage.variation.type.localeCompare(this.refMortgage.variation.type)==0) {
							var initStart = this.initMortgage.refInd.length - this.initMortgage.getRefIndLength();
						startPosition = this.findDate(this.refMortgage.refInd[1].date.date, this.initMortgage.refInd, initStart);
					}
					this.setAllToRefVal(startPosition, ref, this.refMortgage.refTab[this.refMortgage.refTab.length-1][this.refMortgage.variation.type]);

				};


				if(!ref){
					if (this.refMortgage.type.localeCompare('fixe')!==0 
						&& this.refMortgage.variation.type.localeCompare(this.initMortgage.variation.type)==0) {
						var initStart = this.initMortgage.refInd.length - this.initMortgage.getRefIndLength();
					startPosition = this.findDate(this.initMortgage.refInd[initStart].date.date, this.refMortgage.refInd, 1);

				};
				this.setAllToRefVal(startPosition, ref, this.initMortgage.refTab[this.initMortgage.refTab.length-1][this.initMortgage.variation.type]);

			}
		}else{
			if (this.initMortgage.type.localeCompare('fixe')!==0){
				var initStart = this.initMortgage.refInd.length - this.initMortgage.getRefIndLength();
				if (initStart>0) {
					for (var i = initStart; i < this.initMortgage.refInd.length; i++) {
						this.initMortgage.refInd[i].val = this.initMortgage.refTab[this.initMortgage.refTab.length-1][this.initMortgage.variation.type];
					};
				};
			}

			if (this.refMortgage.type.localeCompare('fixe')!==0 ){
				for (var i = 1; i < this.refMortgage.refInd.length; i++) {
					this.refMortgage.refInd[i].val = this.refMortgage.refTab[this.refMortgage.refTab.length-1][this.refMortgage.variation.type];
				};
			}
		};



		this.update(false, true, true);
	},

	findDate : function (date, dateList, start) {
		var found = false;
		var i = start;
		var position = start;
		var dater = date.split('/');
		var monthr = dater[1];
		var yearsr = dater[2];

		while(!found && i<dateList.length){
			var daten = dateList[i].date.date.split('/');

			var month = daten[1];
			var years = daten[2];
			if( years == yearsr){
				if(month >= monthr){
					found = true;
					position = i;
				}
			}else{
				if (years > yearsr) {
					found = true;
					position = i;
				};
			}
			i++;
		}
		return position;
	},

	Limite : function (argument) {

	},
	round : function (val) {
		return Math.round(val*1000)/1000;
	},


/*			equalizeThenUpdateBeta : function  (argument) {

				var minInd = 0;
				var maxInd = 0;
				var lenInit = 1;
				var lenRef = this.refMortgage.refInd.length;
				var found = false;
				var len = 0;
				this.initMortgage.story = 'costum';
				this.refMortgage.story = 'costum';
				if(this.refMortgage.type.localeCompare('fixe')!==0){
					minInd = this.refMortgage.getIndiceMin() ;
					maxInd = this.refMortgage.getIndiceMax();
					
				}

				if(this.initMortgage.type.localeCompare('fixe')!==0){
					lenInit = this.initMortgage.getRefIndLength()+1;
					minInd = this.initMortgage.getIndiceMin() < minInd ? this.initMortgage.getIndiceMin() : minInd;
					maxInd = this.initMortgage.getIndiceMax() > maxInd ? this.initMortgage.getIndiceMax() : maxInd;
					var deb = this.initMortgage.refInd.length - lenInit;
					for (var i = deb; i < this.initMortgage.refInd.length; i++) {
						this.initMortgage.refInd[i].val = minInd;
					};
				}
					for (var i = 1; i < this.refMortgage.refInd.length; i++) {
						this.refMortgage.refInd[i].val = minInd;
					};
				var len = lenRef> lenInit ? lenRef : lenInit;

				

				this.update(false, true, true);

				
				var difference = this.getDiffrence();
				var i = 1;
				while(!found && i<len){
					this.findLimite(minInd, 1, maxInd, difference,i);
					if (this.getDiffrence()<= difference) {
						difference = this.getDiffrence();
					}else{
						this.findLimite(minInd, 1, maxInd, difference,i-1);
						//found = true;
					};
					i++;
				}

			},


			findLimite : function (indice , rank, maxIndice, difference, pos) {
				if (this.indiceAdvantageous(indice+rank, difference, pos)  && indice+rank < maxIndice) {
					var difference = this.getDiffrence();
					this.findLimite(indice+rank, rank, maxIndice, difference, pos);
				}else{
					if (rank>0.001) {
						this.findLimite(indice,rank/10 , maxIndice, difference, pos);
					}else{
						this.indiceAdvantageous(indice, difference, pos);
					}
				}
				this.update(false, true, true);
			},

			indiceAdvantageous : function (indice, difference, pos) {
				var advantageous = false;
				var offset = this.initMortgage.refInd.length - (this.initMortgage.getRefIndLength()+1);

				if (this.refMortgage.refInd.lengt>(this.initMortgage.getRefIndLength()+1)) {
					this.refMortgage.refInd[pos].val=indice;
					var found = false;
					var i = this.initMortgage.getRefIndLength() < pos ? this.initMortgage.refInd.length: pos+offset;
					var dater = this.refMortgage.refInd[pos].date.date.split('/');
					var monthr = dater[1];
					var yearsr = dater[2];
					var first = i - this.initMortgage.getRefIndLength();
					while(!found && i>first){
						var date = this.initMortgage.refInd[i].date.date.split('/');
						var month = date[1];
						var years = date[2];
						if(monthr == month && years == yearsr){
							found = true;
							this.initMortgage.refInd[i].val=indice;
						}
						i--;
					}

				}else{
					this.initMortgage.refInd[pos+offset].val=indice;
					var found = false;
					var i = this.refMortgage.refInd.length-1< pos ? this.refMortgage.refInd.length-1: pos;
					var dater = this.initMortgage.refInd[pos+offset].date.date.split('/');
					var monthr = dater[1];
					var yearsr = dater[2];
					while(!found && i>0){
						var date = this.refMortgage.refInd[i].date.date.split('/');
						var month = date[1];
						var years = date[2];
						if(monthr == month && years == yearsr){
							found = true;
							this.refMortgage.refInd[i].val=indice;
						}
						i--;
					}

				};
				
				this.update(false, true, true);

				if (this.getDiffrence()<= difference) {
					advantageous = true;
				};

				return advantageous;
			},
			*/
			getDifference : function  (argument) {
				return this.initMortgage.totalPaymentIfRef-this.refMortgage.totalPayment;
			},

			/**
			 * [validateData description]
			 * @param  {[type]} durationFirst [description]
			 * @return {[type]}               [description]
			 */
			 validateData : function (durationFirst) {
			 	var found = false;
			 	var linePosition;
			 	var savedDuration = this.refMortgage.duration;
			 	if(this.refMortgage.sameMonthlyPayement){
			 		this.refMortgage.monthlyPayment = this.initMortgage.monthlyPayment;
			 		this.refMortgage.setDuration();
			 	}
			 	this.checkDuration();
			 	if (this.refMortgage.type.localeCompare('fixe')===0) {
			 		this.refMortgage.refInd = this.refMortgage.refInd.slice(0,1);
			 		var i =0;
			 		while(!found && i<5) {
			 			if(this.refMortgage.duration>=this.rateTable[i].duration_min && this.refMortgage.duration<=this.rateTable[i].duration_max  ){
			 				found = true;
			 				linePosition = i;
			 			}
			 			i++;
			 		}

			 	}else{
			 		var tmpLine = -1;
			 		var i =5;
			 		if(durationFirst){
			 			while(!found && i<11) {
			 				if(this.refMortgage.duration>=this.rateTable[i].duration_min && this.refMortgage.duration<=this.rateTable[i].duration_max  ){
			 					tmpLine = i;
			 					var split = this.refMortgage.type.split(' ');
			 					var min = (parseInt(split[3].substring(0,2))*12);
			 					var max = (parseInt(split[5].substring(0,2))*12)+11;
			 					min = min == 300 ? 301 : min;
			 					max = max == 371 ? 360 : max;

			 					if(split[0].localeCompare(this.rateTable[i].type)==0 && min==this.rateTable[i].duration_min && max==this.rateTable[i].duration_max ){
			 						linePosition = i;
			 						found = true;
			 					}else{
			 						linePosition = tmpLine;
			 					}
			 				}

			 				i++;
			 			};
			 			if(!found){
			 				this.refMortgage.type = this.rateTable[linePosition].type+" (+"+this.rateTable[linePosition].cap_pos+'/-'+this.rateTable[linePosition].cap_neg+') de '+Math.floor(this.rateTable[linePosition].duration_min/12)+'ans à '+Math.floor(this.rateTable[linePosition].duration_max/12)+'ans';
			 				this.refMortgage.refInd = this.refMortgage.refInd.slice(0,1);
			 				this.refMortgage.setCap();
			 			}
			 		}else{
			 			this.refMortgage.setCap();
			 			this.refMortgage.refInd = this.refMortgage.refInd.slice(0,1);
			 			var split = this.refMortgage.type.split(' ');
			 			var min = (parseInt(split[3].substring(0,2))*12);
			 			var max = (parseInt(split[5].substring(0,2))*12)+11;
			 			min = min == 300 ? 301 : min;
			 			var tmpline = -1;
			 			while(!found && i<11) {

			 				if(split[0].localeCompare(this.rateTable[i].type)===0 ){
			 					tmpline = i;
			 					if (min==this.rateTable[i].duration_min && max==this.rateTable[i].duration_max) {
			 						tmpline = i;
			 						if(this.refMortgage.duration>=this.rateTable[i].duration_min && this.refMortgage.duration<=this.rateTable[i].duration_max  ){
			 							linePosition = i;
			 							found = true;
			 						}else{
			 							linePosition = tmpline;
			 						}
			 					};

			 				}
			 				linePosition = tmpline;
			 				i++;
			 			}

			 			if(!found){
			 				this.refMortgage.sameMonthlyPayement = false;
			 				this.refMortgage.duration=this.rateTable[linePosition].duration_min;

			 			}
			 			this.checkDuration();


			 		}
			 	}
			 	console.log(found);
			 	if(this.rateTable[linePosition].quotLess.homeSafeOne.indexOf(this.refMortgage.initRate)== -1 && 
			 		this.rateTable[linePosition].quotLess.homeSafeTwo.indexOf(this.refMortgage.initRate)== -1 && 
			 		this.rateTable[linePosition].quotLess.homeSafeThree.indexOf(this.refMortgage.initRate)== -1 && 
			 		this.rateTable[linePosition].quotPlus.homeSafeOne.indexOf(this.refMortgage.initRate)== -1 && 
			 		this.rateTable[linePosition].quotPlus.homeSafeTwo.indexOf(this.refMortgage.initRate)== -1 && 
			 		this.rateTable[linePosition].quotPlus.homeSafeThree.indexOf(this.refMortgage.initRate)== -1 &&
			 		this.refMortgage.initRate !== this.rateTable[linePosition].rate){

					 		this.refMortgage.initRate = this.rateTable[linePosition].rate;
						 	this.refMortgage.rateTable = [];
						 	this.refMortgage.rateTable[0] = this.rateTable[linePosition].rate;
						 	this.refMortgage.rateTable = this.refMortgage.rateTable.concat(
					 			this.rateTable[linePosition].quotLess.homeSafeOne, 
						 		this.rateTable[linePosition].quotLess.homeSafeTwo, 
						 		this.rateTable[linePosition].quotLess.homeSafeThree, 
						 		this.rateTable[linePosition].quotPlus.homeSafeOne, 
						 		this.rateTable[linePosition].quotPlus.homeSafeTwo, 
						 		this.rateTable[linePosition].quotPlus.homeSafeThree 
					 		);


			 }  
			 this.refMortgage.sameMonthlyPayement = false;

			 this.refMortgage.update();

					// se dplacer dans la ligne du tableau en fonction des donnee.
					// une fois deplacer, verifier chaque donnée, si une est different, on lui donne la valeur par defaut de cette ligne
					// ne pas changer de colone
				},
				checkDuration : function  (argument) {
					if(this.refMortgage.duration<72 ){
						this.refMortgage.duration=72;
					}else{
						if(this.refMortgage.duration>360 ){
							this.refMortgage.duration=360;
						}
					}
					this.refMortgage.durationLeft = this.refMortgage.duration;
				},

			/**
			 * [getDurationLeft description]
			 * @param  {[type]} date    [description]
			 * @param  {[type]} newDate [description]
			 * @return {[type]}         [description]
			 */
			 getDurationLeft : function (date, newDate) {
			 	var month = (newDate.getFullYear() - date.getFullYear())*12;
			 	month-= (date.getMonth() - newDate.getMonth());
			 	return this.initMortgage.duration-month;
			 },

			/**
			 * [getSRD description]
			 * @return {[type]} [description]
			 */
			 getSRD : function(){
			 	var period = this.initMortgage.duration - this.durationLeft;
			 	return this.initMortgage.amortization[period-1].SRD;
			 },

			/**
			 * [getIndem description]
			 * @param  {[type]} rate [description]
			 * @return {[type]}      [description]
			 */
			 getIndem : function (rate){
			 	console.log(rate);
			 	rate = Math.round((Math.pow(1 + (rate/100), 1 / 12) - 1)*1000000)/1000000;
			 	return this.SRD*rate*3;
			 },
			/**
			 * [getNewCapital description]
			 * @return {[type]} [description]
			 */
			 getNewCapital : function(){
			 	return this.indem+this.SRD+this.fileCharges;
			 },

			/**
			 * [generateTypeTable description]
			 * @param  {[type]} rateTable [description]
			 * @return {[type]}           [description]
			 */
			 generateTypeTable : function (rateTable) {
				// body...
				this.refMortgage.typeTable = ['fixe'];
				var j = 1;
				for (var i = 5; i < rateTable.length; i++) {
					this.refMortgage.typeTable[j] = rateTable[i].type+" (+"+rateTable[i].cap_pos+'/-'+rateTable[i].cap_neg+') de '+Math.floor(rateTable[i].duration_min/12)+'ans à '+Math.floor(rateTable[i].duration_max/12)+'ans';
					j++;
				};
			},

			/**
			 * [generateRateTable description]
			 * @param  {[type]} rateTable [description]
			 * @return {[type]}           [description]
			 */
			 generateRateTable : function (rateTable) {
			 	var quot = {};
			 	this.rateTable = [];
			 	for (var i = 0; i < rateTable.length; i++) {
			 		this.rateTable[i]= {};
			 		this.rateTable[i].id = parseInt(rateTable[i].id);
			 		this.rateTable[i].cap_neg = parseInt(rateTable[i].cap_neg);
			 		this.rateTable[i].cap_pos = parseInt(rateTable[i].cap_pos);
			 		this.rateTable[i].duration_max = parseInt(rateTable[i].duration_max);
			 		this.rateTable[i].duration_min = parseInt(rateTable[i].duration_min);
			 		this.rateTable[i].type = (rateTable[i].type);
			 		rateTable[i].rate = parseInt(parseFloat(rateTable[i].rate)*100);
			 		this.rateTable[i].rate = (rateTable[i].rate)/100;
			 		this.rateTable[i].quotPlus = {};		
			 		this.rateTable[i].quotLess = {};
			 		this.rateTable[i].quotLess.homeSafeOne = 	[(rateTable[i].rate - (095 ))/100,(rateTable[i].rate - (145 ))/100,(rateTable[i].rate - (165 ))/100];	
			 		this.rateTable[i].quotLess.homeSafeTwo = 	[(rateTable[i].rate - (125 ))/100,(rateTable[i].rate - (175 ))/100,(rateTable[i].rate - (195 ))/100];
			 		this.rateTable[i].quotLess.homeSafeThree = 	[(rateTable[i].rate - (150 ))/100,(rateTable[i].rate - (200 ))/100,(rateTable[i].rate - (220 ))/100];
			 		this.rateTable[i].quotPlus.homeSafeOne = 	[(rateTable[i].rate - (060 ))/100,(rateTable[i].rate - (110 ))/100,(rateTable[i].rate - (130 ))/100];	
			 		this.rateTable[i].quotPlus.homeSafeTwo = 	[(rateTable[i].rate - (100 ))/100,(rateTable[i].rate - (150 ))/100,(rateTable[i].rate - (200 ))/100];
			 		this.rateTable[i].quotPlus.homeSafeThree = 	[(rateTable[i].rate - (125 ))/100,(rateTable[i].rate - (175 ))/100,(rateTable[i].rate - (195 ))/100];
			 	};



			 },
			 getResultsCase : function  (argument) {
			 	this.case=0;
			 	this.leftAvantage = false;
			 	if (this.initMortgage.type.localeCompare('fixe')===0 && this.refMortgage.type.localeCompare('fixe')===0) {
			 		if (this.getDifference()<0 && this.refMortgage.initRate>this.initMortgage.initRate) {
			 			this.case = 1;
			 		}else{
			 			if (this.getDifference()<0 && this.refMortgage.initRate<this.initMortgage.initRate) {
			 				console.log(this.getDifference());
			 				this.case = 2;
			 			};
			 		};
			 	}else{
			 		if (this.initMortgage.type.localeCompare('fixe')!==0 && this.refMortgage.type.localeCompare('fixe')!==0) {
			 			this.leftAvantage = this.variableWait();
			 			if(this.leftAvantage !==false){
			 				this.case = 3;
			 			}else{
			 				if (this.getDifference()<0 && this.refMortgage.initRate>this.initMortgage.initRate) {
			 					this.case = 1;
			 				}else{
			 					if (this.getDifference()<0 && this.refMortgage.initRate<this.initMortgage.initRate) {
			 						console.log(this.getDifference());
			 						this.case = 2;
			 					};
			 				};
			 			}


			 		}else{
			 			if (this.initMortgage.type.localeCompare('fixe')===0 && this.refMortgage.type.localeCompare('fixe')!==0) {

			 			}else{
			 				this.leftAvantage = this.variableWait();
			 				if(this.leftAvantage !==false){
			 					this.case = 3;
			 				}else{
			 					if (this.getDifference()<0 && this.refMortgage.initRate>this.initMortgage.initRate) {
			 						this.case = 1;
			 					}else{
			 						if (this.getDifference()<0 && this.refMortgage.initRate<this.initMortgage.initRate) {
			 							console.log(this.getDifference());
			 							this.case = 2;
			 						};
			 					};
			 				}


			 			}
			 		};
			 	};
			 	if (this.case ==1 ) {
			 		this.setBestRate();
			 	};
			 },
			 
			 setBestRate : function function_name (argument) {
			 	this.bestRate=[];
			 	var saveRate = this.refMortgage.initRate;
			 	for (var i = 0; i < this.refMortgage.rateTable.length; i++) {
			 		this.refMortgage.initRate = this.refMortgage.rateTable[i];
			 		this.refMortgage.update();
			 		if (this.initMortgage.type.localeCompare('fixe')!==0 && this.refMortgage.type.localeCompare('fixe')!==0
			 			|| (this.initMortgage.type.localeCompare('fixe')!==0 && this.refMortgage.type.localeCompare('fixe')==0)){
			 			var wait = this.variableWait();
			 			if (wait ==false) {
			 				if (this.refMortgage.initRate<this.initMortgage.initRate && this.refMortgage.monthlyPayment < this.initMortgage.monthlyPayment && this.getDifference()>0) {
					 			this.bestRate.push(this.refMortgage.rateTable[i]);
					 		}
			 			};
			 		}else{
		 				if (this.refMortgage.initRate<this.initMortgage.initRate && this.refMortgage.monthlyPayment < this.initMortgage.monthlyPayment && this.getDifference()>0)  {
				 			this.bestRate.push(this.refMortgage.rateTable[i]);
				 		}
			 		}

			 	};
			 	if (this.bestRate.length>0) {
			 		this.bestRateVal = this.bestRate[0];
			 	};
			 	this.refMortgage.initRate = saveRate;
			 	this.refMortgage.update();
			 },

			 variableWait : function (argument) {
			 	var refYears = this.refMortgage.date.getFullYear();
			 	var initDate = 0;
			 	var refDate = 0;
			 	var ok= false;
			 	var initpos = 0;

			 	if (this.refMortgage.type.localeCompare('fixe')!==0) {
			 		var tmp = this.refMortgage.refInd[1].date.date.split('/');
			 		refDate = parseInt(tmp[2]);
			 	}

			 	if (this.initMortgage.type.localeCompare('fixe')!==0) {
			 		var i=1;
			 		var found = false;
			 		if (this.initMortgage.refInd.length>1) {
			 			while(!found && i< this.initMortgage.refInd.length){
			 				var tmp = this.initMortgage.refInd[i].date.date.split('/');
			 				var y = parseInt(tmp[2]);
			 				if (y> refYears) {
			 					initDate = y;
			 					this.initpos = i;
			 					found = true;

			 				};
			 				i++;
			 			}
			 		};
			 	}


			 	if(refDate == 0 && initDate !==0){
			 		if (initDate - refYears < 3) {
			 			if (this.initMortgage.refInd[this.initpos].rate < this.refMortgage.initRate && this.initMortgage.refInd[this.initpos-1].rate > this.refMortgage.initRate){
			 				ok = initDate - refYears;
			 			};
			 		}

			 	}else{
			 		if(refDate !== 0 && initDate !==0){
			 			if (initDate < refDate  &&  initDate - refYears < 3) {

			 				if (this.initMortgage.refInd[this.initpos].rate < this.refMortgage.initRate){
			 					ok = initDate - refDate;
			 				};
			 			}

			 		}
			 	}
			 	console.log(this.initpos);
			 	return ok;
			 }









			};

			return Refinancing;

		});
});
