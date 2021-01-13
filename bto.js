javascript:(function(){
	let css_selector_block_num = "td[style~='background-color:#fffac2']";
	let block_num = document.querySelector(css_selector_block_num).innerText;

	let css_selector_units = "table > tbody > tr > td";
	let units = document.querySelectorAll(css_selector_units);

	let results = [];
	for (let i = 0; i < units.length; i++) {
	    let floor_and_unit_number = units[i].innerText;
	    if (floor_and_unit_number[0] != '#') {
	        continue;
	    }

	    let unit_number = floor_and_unit_number.split("-")[1];

	    let css_selector_unit_tooltip = `span[data-selector='${floor_and_unit_number}']`;
	    let tooltip_elem = document.querySelector(css_selector_unit_tooltip);

	    if (tooltip_elem === null) {
	        continue;
	    }

	    let tooltip_text = tooltip_elem.title;
	    let tooltip_array = tooltip_text.split("<br>");
	    let price_text = tooltip_array[0];
	    let sqm_text = tooltip_array[2];

	    let price = parseInt(price_text.replace("$", "").replace(",", ""));
	    let sqm = parseInt(sqm_text.replace(" Sqm", ""));
	    let price_per_sqm = (price / sqm).toFixed(2);

	    results.push({
	        'floor_and_unit_number': floor_and_unit_number,
	        'unit_number': unit_number,
	        'price': price_text,
	        'price_per_sqm': price_per_sqm,
	        'sqm': sqm_text,
	    });
	}

	function render(display_list) {
	    let unit_info_space = popup.document.getElementById("unitInformation");
	    unit_info_space.innerHTML = "";

	    for (let i = 0; i < display_list.length; i++) {
	        let item = display_list[i];
	        unit_info_space.innerHTML += `
				${i+1}) ${item['floor_and_unit_number']}: ${item['price']} (${item['sqm']}, $${item['price_per_sqm']}/sqm) <br>
			`;
	    }
	}

	let popup = window.open("", "", 'width=400,height=400,toolbar=0,menubar=0,titlebar=0');
	popup.document.title = `Block ${block_num}`;

	popup.document.body.innerHTML = `
		<h2>Block ${block_num}</h2>
		<div id="buttons" style="margin:5px;"></div>
		<div id="unitInformation" style="margin:5px;"></div>
	`;

	let unit_keys = Object.keys(results[0]);
	let buttons_section = popup.document.getElementById("buttons");
	for (let i = 0; i < unit_keys.length; i++) {
	    let key_name = unit_keys[i];
	    let button = popup.document.createElement("button");
	    button.setAttribute("style", `
			display:block;
			margin:2px;
			text-decoration: none;
			border-radius: 5px;
			color: black;
			border: 2px solid #000000;
		`);

	    button.setAttribute("id", `sort_${key_name}_btn`);

	    button.onclick = function() {
	        results.sort((a, b) => (a[key_name] > b[key_name]) ? 1 : ((b[key_name] > a[key_name]) ? -1 : 0));
	        render(results);
	    };

	    let key_name_display = key_name.split("_").join(" ");
	    button.innerHTML = `Sort by ${key_name_display}`;
	    buttons_section.appendChild(button);
	}

	popup.document.getElementById(`sort_${Object.keys(results[0])[0]}_btn`).click();
})();
