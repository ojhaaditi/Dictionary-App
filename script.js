const form = document.querySelector('form');
const resultDiv = document.querySelector('.result');

form.addEventListener('submit', async (e) => { 
    e.preventDefault();
    await getWordInfo(form.elements[0].value);
});

const getWordInfo = async (word) => {
    resultDiv.innerHTML = "Fetching Data...";
    try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();

        // Clear previous results
        let output = `<h2><strong>Word:</strong> ${data[0].word}</h2>`;
        let meanings = data[0].meanings;

        // Loop through all meanings
        meanings.forEach(meaning => {
            // Display the part of speech
            output += `<p class="part-of-speech"><strong>Part of Speech:</strong> ${meaning.partOfSpeech}</p>`;
            
            // Initialize variables to store antonyms and synonyms
            let allAntonyms = [];
            let allSynonyms = [];
            let firstDefinitionDisplayed = false;

            meaning.definitions.forEach(definition => {
                // Display the meaning and example only once per meaning
                if (!firstDefinitionDisplayed) {
                    output += `<p><strong>Meaning:</strong> ${definition.definition || "not found"}</p>`;
                    if (definition.example) {
                        output += `<p><strong>Example:</strong> ${definition.example}</p>`;
                    }
                    firstDefinitionDisplayed = true; // Mark that we've displayed the first definition
                }

                // Collect antonyms and synonyms
                if (definition.antonyms) {
                    allAntonyms = allAntonyms.concat(definition.antonyms);
                }
                if (definition.synonyms) {
                    allSynonyms = allSynonyms.concat(definition.synonyms);
                }
            });

            // Display antonyms
            if (allAntonyms.length === 0) {
                output += '<p><strong>Antonyms:</strong> Not Found</p>';
            } else {
                output += '<p><strong>Antonyms:</strong><ul>';
                allAntonyms.forEach(antonym => {
                    output += `<li>${antonym}</li>`;
                });
                output += '</ul></p>';
            }

            // Display synonyms
            if (allSynonyms.length === 0) {
                output += '<p><strong>Synonyms:</strong> Not Found</p>';
            } else {
                output += '<p><strong>Synonyms:</strong><ul>';
                allSynonyms.forEach(synonym => {
                    output += `<li>${synonym}</li>`;
                });
                output += '</ul></p>';
            }
        });

        // Adding Read More button
        output += `<a href="${data[0].sourceUrls[0]}" target="_blank">Read More</a>`;
        resultDiv.innerHTML = output;

    } catch (error) {
        resultDiv.innerHTML = `<h2>Sorry, the word could not be found.</h2>`;
        console.error('Error fetching word info:', error);
    }
}
