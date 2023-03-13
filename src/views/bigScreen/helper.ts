enum DistrictLevel {
	PROVINCE = "province",
	CITY = "city",
	COUNTY = "county",
	TOWN = "town",
	VILLAGE = "village"
}

export function getDistrictLevel(districtCode: string | number) {
	let level;

	const districtCode1 = districtCode + "";
	if (districtCode1.length === 6) {
		if (districtCode1.match(/\d{2}0000$/)) {
			level = DistrictLevel.PROVINCE; // 省级
		} else if (districtCode1.match(/\d{4}00$/)) {
			level = DistrictLevel.CITY; // 市级
		} else {
			level = DistrictLevel.COUNTY; // 县、区级
		}
	} else if (districtCode1.length === 9) {
		level = DistrictLevel.TOWN; // 乡、镇级
	} else {
		level = DistrictLevel.VILLAGE; // 村级
	}

	return level;
}
