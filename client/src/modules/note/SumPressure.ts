export const sum = (nums: number[]) => {
	var total = 0;
	for (var i = 0, len = nums.length; i < len; i++) total += nums[i];
	return total;
};