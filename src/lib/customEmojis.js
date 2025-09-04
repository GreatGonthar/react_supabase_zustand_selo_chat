import {
	Laie,
	LaieBaseUrl,
	madhouse,
	madhouseBaseUrl,
	personal,
	personalBaseUrl,
	rpg,
	rpgBaseUrl,
	standart,
	standartBaseUrl,
} from "./emojiCollections";

const emojisCreator = (collectionName, arr, baseurl) => {
	return {
		id: collectionName,
		name: collectionName,
		emojis: arr.map((elem, index) => {
			return {
				id: elem,
				name: elem,
				emoji: "",
				keywords: [],
				skins: [{ src: `${baseurl}${elem}.gif` }],
			};
		}),
	};
};
const standartCollection = emojisCreator("стандартные", standart, standartBaseUrl);
const rpgCollection = emojisCreator("RPG", rpg, rpgBaseUrl);
const madhouseCollection = emojisCreator("палата №6", madhouse, madhouseBaseUrl);
const personalCollection = emojisCreator("персоны", personal, personalBaseUrl);
const laieCollection = emojisCreator("laie", Laie, LaieBaseUrl);
export const customEmojis = [
	{
		...standartCollection,
	},
	{
		...rpgCollection,
	},
	{
		...madhouseCollection,
	},
	{
		...personalCollection,
	},
	{
		...laieCollection,
	},
];
