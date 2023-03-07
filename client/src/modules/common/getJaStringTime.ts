const dates = ["year", "month", "day", "hour", "min", "sec"] as const;
const finishString = ["/", "/", " ", ":", ":", ""];
type DateType = typeof dates[number];

export const getJaStringTime = (from: DateType = "year", until: DateType = "sec") => {
  const now = new Date();

  const Year = now.getFullYear();
  const Month = now.getMonth()+1;
  const Day = now.getDate();
  const Hour = now.getHours();
  const Min = now.getMinutes();
  const Sec = now.getSeconds();

  const nowList: string[] = [String(Year), String(Month), String(Day), String(Hour), String(Min), String(Sec)];

  const FromIndex = dates.indexOf(from);
  const UntilIndex = dates.indexOf(until);

  let res: string = "";
  for(let i = FromIndex; i <= UntilIndex; i++) {
    nowList[i] = nowList[i].length == 1
      ? "0" + nowList[i]
      : nowList[i]; 
    res = i<UntilIndex
      ? res + nowList[i] + finishString[i]
      : res + nowList[i];
  }

  return res;
}