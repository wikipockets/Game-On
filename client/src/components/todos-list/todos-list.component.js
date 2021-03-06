// We should break out these components into separate files
import React, {
    Component
} from 'react';
import axios from 'axios';
import "./list.css";

import Carousel from '../new-release/new-release';
import ComingSoon from '../coming-soon/coming-soon';

class Img extends Component {
    constructor(props) {
        super(props)
        this.state = {
            src: ""
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.src !== prevProps.src) {
            this.getImageId()
        }
    }

    // componentDidUpdate() {
    //     this.getImageId();
    // }
    componentDidMount() {
        this.getImageId();
    }

    getImageId() {
        axios.get(`http://localhost:4000/api/images/${this.props.src}`)
            .then(response => {
                console.log(response.data)
                this.setState({
                    src: response.data
                })
            })
            .catch(err => console.log(err))
    }
    render() {
        return (<img src={
            this.state.src
        }
            alt={
                this.props.alt
            }
            style={
                {
                    height: "150px",
                    width: "200px",
                    borderRadius: "10px"
                }
            }
        />
        )
    }
}

const Game = props => (
    <tr>
        <td>
            <Img src={props.game.cover}
                alt={props.game.name} /></td>
        <td> <a href={props.game.url}>{props.game.name}</a> </td>
        <td> {props.game.summary} </td>
        <td> {Math.round(props.game.total_rating)} </td>
    </tr >
)

export default class GamesList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            games: [],
            query: "",
            value: ''
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }

    handleChange(event) {
        this.setState({
            value: event.target.value
        });
    }

    async handleSubmit(event) {
        event.preventDefault();
        await this.setState({
            query: this.state.value,
            value: ''
        })
        this.getGames()
    }

    componentDidMount() {
        this.getGames();
    }

    getGames() {
        axios.get(`http://localhost:4000/api/games/${this.state.query}`)
            .then(response => {
                console.log(response.data)
                this.setState({
                    games: response.data
                });
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    gameList() {
        return this.state.games.map(function (game, i) {
            return <Game game={
                game
            }
                key={
                    i
                }
            />;
        })
    }

    render() {
        return (
            <div>

                <Carousel />
                <ComingSoon />

                <form onSubmit={this.handleSubmit}>
                    <label>
                        Search:
            <input
                            type="text"
                            value={this.state.value}
                            onChange={this.handleChange}
                        />
                    </label>
                    <input type="submit" value="Submit" />
                </form>

                <table className="table table-striped" style={{ marginTop: 20 }}>
                    <thead>
                        <tr>
                            <th>Cover</th>
                            <th>Name</th>
                            <th>Summary</th>
                            <th>Rating</th>
                        </tr>
                    </thead>
                    <tbody>{this.gameList()}</tbody>
                </table>
            </div>
        )
    }
}