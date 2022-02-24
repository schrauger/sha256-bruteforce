# sha256-bruteforce
Simple test app to brute force sha256 hashes

## Installing
`git clone https://github.com/schrauger/sha256-bruteforce.git`

`cd` into the directory, then run `npm i` to install the modules.

## Usage
### Heroku
The service is available at https://immense-thicket-30008.herokuapp.com/

On the page, fill out the string and the difficulty (number of leading 0s), and <kdb>Submit</kbd>.
* If the difficulty level is too high, the server will cap the counter at 3,000,000 and return false. Try to keep the difficulty level below 24.

To prove the work, switch to the `Verify` mode and fill in the same parameters, plus the known valid counter value. Submit the form, and the server will validate or invalidate the proof.

### Local
To run the service locally, run the develop command: `npm start develop`.
* This requires port 3000 and 3001 to be available

Open http://localhost:3000 and follow the instructions listed in the Heroku section
