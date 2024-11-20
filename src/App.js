import logo from "./logo.svg";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Container,
  InputGroup,
  FormControl,
  Button,
  Row,
  Card,
} from "react-bootstrap";
import { useState } from "react"; // Importing React's useState hook to manage state

function PokemonCardFinder() {
  const [searchQuery, setSearchQuery] = useState(""); // State to hold user's search query
  const [cardData, setCardData] = useState([]); // State to hold fetched card data
  var myKey = process.env.REACT_APP_MY_KEY;

  // Function to search for Pokémon cards
  async function search() {
    // Setting up for API requests
    const authParameters = {
      method: "GET",
      headers: { "x-Api-Key": myKey },
    };

    try {
      // Fetching data from Pokémon TCG API using the search query
      const response = await fetch(
        `https://api.pokemontcg.io/v2/cards?q=name:${encodeURIComponent(
          searchQuery
        )}`,
        authParameters
      );
      // Error handling
      if (!response.ok) {
        throw new Error("HTTP error! Status: ${response.status}");
      }
      const data = await response.json(); // Parsing JSON response
      setCardData(data.data); // Setting fetched card data to the state
    } catch (error) {
      console.error("Error fetching card data:", error); // Logging errors
    }
  }

  return (
    <div className="App">
      <Container> {/* Main container for search input */}
        <InputGroup className="mb-3" size="lg"> {/* Input Group for search bar */}
          <FormControl
            placeholder="Search For Card"
            type="input"
            value={searchQuery} // Value is binded to searchQuery's state
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                search(); // Searching when Enter is pressed
              }
            }}
            onChange={(event) => setSearchQuery(event.target.value)} // Updating searchQuery as the user types
          />
          <Button onClick={search}>Search Card</Button> {/* Search button for user's preference*/}
        </InputGroup>
      </Container>

      <Container> {/* Container for displaying cards */}
        <Row className="mx-2 row row-cols-4"> {/* Row to keep cards in a grid, max cards in a row is 4 */}
          {/* Checking if cardData exists */}
          {cardData.length > 0 ? ( 
            cardData.map((card) => ( // Mapping through cardData and creating individual card components
              <Card key={card.id} className="mb-4">
                {/* Displaying card image */}
                <Card.Img 
                  variant="top"
                  src={card.images?.small}
                  alt={card.name}
                />
                <Card.Body>
                  <Card.Title>{card.name}</Card.Title>
                  <Card.Text>
                    <b>Set:</b> {card.set?.name} <br />
                    <b>Market Price:</b> {/* Displaying prices for all types */}
                    {card.tcgplayer?.prices ? (
                      <>
                        <div>
                          <b>Normal:</b>{" "}
                          {card.tcgplayer.prices.normal?.market
                            ? `$${card.tcgplayer.prices.normal.market.toFixed(
                                2 
                              )}`
                            : "N/A"}
                        </div>
                        <div>
                          <b>Holofoil:</b>{" "}
                          {card.tcgplayer.prices.holofoil?.market
                            ? `$${card.tcgplayer.prices.holofoil.market.toFixed(
                                2
                              )}`
                            : "N/A"}
                        </div>
                        <div>
                          <b>Reverse Holofoil:</b>{" "}
                          {card.tcgplayer.prices.reverseHolofoil?.market
                            ? `$${card.tcgplayer.prices.reverseHolofoil.market.toFixed(
                                2
                              )}`
                            : "N/A"}
                        </div>
                        <div>
                          <b>1st Edition Holofoil:</b>{" "}
                          {card.tcgplayer.prices["1stEditionHolofoil"]?.market
                            ? `$${card.tcgplayer.prices[
                                "1stEditionHolofoil"
                              ].market.toFixed(2)}`
                            : "N/A"}
                        </div>
                        <div>
                          <b>1st Edition Normal:</b>{" "}
                          {card.tcgplayer.prices["1stEditionNormal"]?.market
                            ? `$${card.tcgplayer.prices[
                                "1stEditionNormal"
                              ].market.toFixed(2)}`
                            : "N/A"}
                        </div>
                      </>
                    ) : (
                      "No pricing information available."
                    )}
                    <br />
                  </Card.Text>
                </Card.Body>
              </Card>
            ))
          ) : (
            <p>No cards found.</p>
          )}
        </Row>
      </Container>
    </div>
  );
}

export default PokemonCardFinder;
