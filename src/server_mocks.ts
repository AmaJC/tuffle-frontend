import { ROWS, COLS, createLetterStates } from "./utils";

export type ServerResponse = {
	guessedWords: Array<string>,
	boardColors: Array<string>,
	letterColors: string,
	showInvalidGuessAnimation: boolean,
}
// TODO
// Stub functions for the Server API calls for local testing
export async function wordleKeyPressed(key: string)
	: Promise<ServerResponse> {

	console.log("Wordle Key Pressed ", key);

	// const response = await fetch(
	// 	'http://localhost:18080/wordle_key_pressed/' + key);
  const response = await fetch(
		'https://wordlebackend-1.amajc.repl.co/wordle_key_pressed/' + key);
	const data = await response.json();
  // const data = {
	// 	guessedWords: ["DINOS", "HALLS", "HALLS",
	// 				"COOfD", "HALLS", "HALLS"],
	// 	boardColors: ["BBGGY",  "BBGGY", "BBGGY",
	// 				"BBGGY", "BBGGY", "BBGGY"],
	// 	letterColors: "BBBBBBBBBBBBBBBBBBBBBBGYDB",
	// 	showInvalidGuessAnimation:false,
	// }
  console.log("wordleKeyPressed server response 1: ", data);

	let sr = {
		guessedWords: data['guessedWords'],
		boardColors: data['boardColors'],
		letterColors: data['letterColors'],
		showInvalidGuessAnimation:false,
    guessCount: 4,
	};

	console.log("wordleKeyPressed server response 2: ", sr);
  console.log("wordleKeyPressed cleaned: ", cleanResponse(sr));
	return cleanResponse(sr);
}

export async function checkGuess(): Promise<ServerResponse> {
  // `game.guesses` is the number of guesses the user has submitted.
  // This checks if the word at index game.guesses has less letters
  // than the number of columns, and reports to the user if there are
  // not enough letters in their guess.
  // toaster.pop("Not enough letters");
  // if (game.board.words[game.guesses].length !== COLS) {
  //
  //   board.shake(game.guesses);
  // } else if (words.contains(game.board.words[game.guesses])) {
  //   // `words.contains` accesses a dictionary of all valid words.
  //   const state = getState(word, game.board.words[game.guesses]);
  //   game.board.state[game.guesses] = state;
  //   state.forEach((e, i) => {
  //     const ls = $letterStates[game.board.words[game.guesses][i]];
  //     if (ls === "🔳" || e === "🟩") {
  //       $letterStates[game.board.words[game.guesses][i]] = e;
  //     }
  //   });
  //   ++game.guesses;
  //   if (game.board.words[game.guesses - 1] === word) {
  //     win();
  //   } else if (game.guesses === ROWS) {
  //     lose();
  //   }
  // } else {
  //   toaster.pop("Not in word list");
  //   board.shake(game.guesses);
  // }

  // BELOW IS ORIGINAL

	console.log("checkGuess");

	const response = await fetch(
		'https://wordlebackend-1.amajc.repl.co/enter_pressed');
	const data = await response.json();

  console.log("checkGuess server response 1: ", data);

	let sr = {
		guessedWords: data['guessedWords'],
		boardColors: data['boardColors'],
		letterColors: data['letterColors'],
		showInvalidGuessAnimation:false,
    guessCount: 4,
	};

	console.log("checkGuess server response 2: ", sr);
  console.log("checkGuess cleaned: ", cleanResponse(sr));
	return cleanResponse(sr);
}

export async function deleteKeyPressed()
	: Promise<ServerResponse> {

	console.log("Delete Key Pressed");

	// const response = await fetch(
	// 	'http://localhost:18080/delete_pressed');
  const response = await fetch(
		'https://wordlebackend-1.amajc.repl.co/delete_pressed');
	const data = await response.json();

	let sr = {
		guessedWords: data['guessedWords'],
		boardColors: data['boardColors'],
		letterColors: data['letterColors'],
		showInvalidGuessAnimation:false,
    guessCount: 4,
	};

	return cleanResponse(sr);
}

function cleanResponse(server_response: ServerResponse)
	: ServerResponse {

	let cleanedGuesses = server_response.guessedWords.concat(
		Array(ROWS - server_response.guessedWords.length)
		.fill(""));

	let cleanedColors = server_response.boardColors.concat(
		Array(ROWS - server_response.boardColors.length)
		.fill("BBBBB"));

	let cleanedLetterColors = (server_response.letterColors
		+ "BBBBBBBBBBBBBBBBBBBBBBBBBB").substring(0, 26);


	let cleaned_server_response = {
		guessedWords: cleanedGuesses,
		boardColors: cleanedColors,
		letterColors: cleanedLetterColors,
		showInvalidGuessAnimation: false,
    guessCount: 4,
	};

	return cleaned_server_response;
}

export function emptyResponse(): ServerResponse {
	return {
		guessedWords: Array(6).fill(""),
		boardColors: Array(6).fill("BBBBB"),
		letterColors: "BBBBBBBBBBBBBBBBBBBBBBBBBB",
		showInvalidGuessAnimation:false,
	}
}

export function boardStateFromServerResponse(
	server_response: ServerResponse): LetterState[][] {
	let boardColors = server_response["boardColors"];
	let letterStates = [];

	for (let i = 0; i < boardColors.length; i++) {
		letterStates.push([]);
		for (let j = 0; j < boardColors[i].length; j++) {
			switch(boardColors[i][j]) {
				case "G":
					letterStates[i].push("🟩");
					break;
				case "Y":
					letterStates[i].push("🟨");
					break;
				// case "D":
				// 	letterStates[i].push("⬛");
				// 	break;
				case "B":
				default:
					letterStates[i].push("⬛");
				break;
			}
		}
	}
	return letterStates;
}

export function letterStateFromServerResponse(server_response:
	ServerResponse): { [key: string]: LetterState; } {

	let letterColors = server_response["letterColors"];
	let letterStates = createLetterStates();

	let letters = "abcdefghijklmnopqrstuvwxyz";

	for (let i = 0; i < letters.length; i++) {
		let val;
		switch(letterColors[i]) {
			case "G":
				val = "🟩";
				break;
			case "Y":
				val = "🟨";
				break;
			case "D":
				val = "⬛";
				break;
			case "B":
			default:
				val = "🔳";
			break;
		}
		letterStates[letters[i]] = val;
	}
	return letterStates;
}