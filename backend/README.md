# atcoder-brainfuck-backend

## Prerequisites

- [Cargo](https://doc.rust-lang.org/cargo/index.html)
- [PostgreSQL](https://www.postgresql.org/)

## Installation

To be written.

## Development

Make sure PostgreSQL is running.

```sh
$ cargo run --bin run_server
```

To enable auto-reloading, use [cargo-watch](https://github.com/watchexec/cargo-watch).

```sh
$ cargo watch -x 'run --bin run_server'
```

## Build

```sh
$ cargo build --bin run_server --release
```
