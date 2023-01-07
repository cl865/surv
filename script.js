
// helper function, fix probability interval

function probInt(x) {
	if (x < 0){
		x = Math.max(0, x);
	}
	if(x > 1){
		x = Math.min(1,x);
	}
	return x;
}

// calculation for nomogram

function calc() {

	// first obtain age_val, if missing, report missing
	var age_val = parseFloat(document.getElementById("age_input").value);


	if (isNaN(age_val)) {
		document.getElementById('display').innerHTML = "Age input is missing.";
	} else {


	// map age to points via regression: points = -12.667 + 1.253 * age	

	var PT; 

	if (age_val <= 10) {
		var PT = 0.00
	} else if (age_val >= 90){
		var PT =  100.00
	} else {
		var PT = -12.667 + 1.253*age_val
	}


	// check male vs female
	// isMale is true/false var, T if male
	var isMale = document.querySelector('input[name="sex"]:checked').value === "male";

	// get cdcs as string
	var cdcs = document.querySelector('input[name="cdcs"]:checked').value;


	// update PT here
	PT = PT + (12 * isMale) + 13 * (cdcs === "1") + 20 * (cdcs === "2") + 28 * (cdcs === "3");

	// evaluate all mets
	// following var will be true/false
	var bone = document.querySelector('input[name="bone"]:checked').value;
	var brain = document.querySelector('input[name = "brain"]:checked').value;
	var liver = document.querySelector('input[name = "liver"]:checked').value;
	var lung = document.querySelector('input[name = "lung"]:checked').value;

	// update PT for mets
	PT = PT + 24 * (bone === "no") + 36*(bone === "yes") + 6*(brain === "no") + 9*(brain === "other") + 26*(liver === "yes") + 5*(liver === "other") + 13*(lung === "yes") + 6*(lung === "other");


	// include primary site
	var site = document.querySelector('input[name = "primary"]:checked').value;

	// update PT with site
	PT = PT + 57*(site === "other") + 0*(site === "prostate") + 11*(site === "breast") + 88*(site === "lung");

	// add RT site

	var RTbrain = document.querySelector('input[name="RTbrain"]:checked').value === "yes";
	var RTheent = document.querySelector('input[name="RTheent"]:checked').value === "yes";
	var RTthorax = document.querySelector('input[name="RTthorax"]:checked').value === "yes";
	var RTgit = document.querySelector('input[name="RTgit"]:checked').value === "yes";
	var RTbreast = document.querySelector('input[name="RTbreast"]:checked').value === "yes";
	var RTbone = document.querySelector('input[name="RTbone"]:checked').value === "yes";
	var RTsoft = document.querySelector('input[name="RTsoft"]:checked').value === "yes";
	var RTpelvis = document.querySelector('input[name="RTpelvis"]:checked').value === "yes";
	var RTother = document.querySelector('input[name="RTother"]:checked').value === "yes";
	
	// update PT
	PT = PT + 28*RTbrain + 0*RTheent + 17*RTthorax + 26*RTgit + 13*RTbreast + 0*RTbone + 24*RTsoft + 19*RTpelvis + 7*RTother;

	// map points to 1 year survival, via linear regression

	var surv1 = Math.round((1.0932 - 0.003887*PT)*100)/100.0;

	// map points to 5 year survival, via linear regression

	var surv5 = Math.round((0.831186 - 0.004065*PT)*100)/100.0;

	// also interested in deriving risk category

	// based on output of Cox PH model, and comapre to predetermined threshold values

	idx = 0.0155464*age_val + 0.1450274*(isMale) + 0.1560243*(cdcs === "1") + 0.2525048*(cdcs === "2") + 0.3465049* (cdcs === "3") + 
	0.1573784*(bone === "yes") - 0.2944781*(bone === "others") - 0.0711159*(brain === "yes") + 0.0466455*(brain === "other") + 0.3260978*(liver === "yes") + 0.0614781*(liver === "other") + 0.1648826*(lung === "yes") + 0.0750241*(lung === "other") - 
	0.3462815*RTheent - 0.1426271*RTthorax - 0.0279156*RTgit - 0.1896639*RTbreast - 0.3504433*RTbone - 0.0519226*RTsoft - 0.1191780*RTpelvis - 0.2645642*RTother - 0.7137100*(site === "prostate") - 0.5789938*(site === "breast") + 0.3794711*(site === "lung");

	// now find category based on idx using threshold values
	if (idx < -0.1218151){
		cat = "Low";
	} else if (idx > 0.2415489) {
		cat = "High";
	} else {
		cat = "Medium";
	}


	// display results, bound by 0 and 1
	document.getElementById('display_surv1').innerHTML = probInt(surv1);
	document.getElementById('display_surv5').innerHTML = probInt(surv5);
	document.getElementById('display_cat').innerHTML = probInt(cat)
	
	// tmp checks
	// document.getElementById('display').innerHTML = PT

	}

 }