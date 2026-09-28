// ========================================
// KONFIGURASI OMDb API
// ========================================

// Masukkan API Key OMDb kamu di sini
const API_KEY = "4ba57e1e";

const BASE_URL = "https://www.omdbapi.com/";


// ========================================
// FUNCTION SEARCH MOVIE
// ========================================

function searchMovie() {

    // Mengambil kata yang diketik pengguna
    const keyword = $("#search-input").val().trim();

    // Jika input kosong
    if (keyword === "") {

        $("#message")
            .text("Silakan masukkan judul film terlebih dahulu.")
            .show();

        $("#movie-list").html("");

        return;
    }


    // Menampilkan loading
    $("#loading").show();

    // Sembunyikan pesan
    $("#message").hide();

    // Hapus hasil pencarian sebelumnya
    $("#movie-list").html("");


    // ========================================
    // MEMANGGIL OMDb API
    // ========================================

    $.ajax({

        url: BASE_URL,

        method: "GET",

        data: {
            apikey: API_KEY,
            s: keyword
        },

        success: function (result) {

            console.log(result);

            // Sembunyikan loading
            $("#loading").hide();


            // Jika film tidak ditemukan
            if (result.Response === "False") {

                $("#message")
                    .text(result.Error)
                    .show();

                return;
            }


            // Menampilkan daftar film
            displayMovies(result.Search);

        },

        error: function (error) {

            console.log(error);

            $("#loading").hide();

            $("#message")
                .text("Gagal menghubungi OMDb API.")
                .show();

        }

    });

}


// ========================================
// MENAMPILKAN FILM
// ========================================

function displayMovies(movies) {

    $("#movie-list").html("");


    movies.forEach(function (movie) {

        let poster = movie.Poster;


        // Jika poster tidak tersedia
        if (poster === "N/A") {

            poster =
                "https://via.placeholder.com/300x400?text=No+Poster";

        }


        // Membuat card film
        const card = `

            <div class="col-12 col-sm-6 col-md-4 col-lg-3">

                <div class="card movie-card shadow-sm">

                    <img
                        src="${poster}"
                        class="card-img-top"
                        alt="${movie.Title}">

                    <div class="card-body d-flex flex-column">

                        <h5 class="card-title movie-title">
                            ${movie.Title}
                        </h5>

                        <p class="card-text text-muted">
                            Tahun: ${movie.Year}
                        </p>

                        <p class="card-text">
                            Tipe: ${movie.Type}
                        </p>

                        <button
                            class="btn btn-primary mt-auto see-detail"
                            data-id="${movie.imdbID}"
                            data-bs-toggle="modal"
                            data-bs-target="#movieModal">

                            See Detail

                        </button>

                    </div>

                </div>

            </div>

        `;


        $("#movie-list").append(card);

    });

}


// ========================================
// BUTTON SEARCH
// ========================================

$("#button-search").click(function () {

    searchMovie();

});


// ========================================
// TOMBOL ENTER
// ========================================

$("#search-input").keypress(function (event) {

    if (event.which === 13) {

        searchMovie();

    }

});


// ========================================
// SEE DETAIL
// ========================================

$(document).on(
    "click",
    ".see-detail",
    function () {

        const imdbID = $(this).data("id");

        getMovieDetail(imdbID);

    }
);


// ========================================
// DETAIL FILM
// ========================================

function getMovieDetail(imdbID) {

    $.ajax({

        url: BASE_URL,

        method: "GET",

        data: {

            apikey: API_KEY,

            i: imdbID,

            plot: "full"

        },

        success: function (movie) {

            console.log(movie);


            // Jika film tidak ditemukan
            if (movie.Response === "False") {

                alert(movie.Error);

                return;

            }


            let poster = movie.Poster;


            // Jika poster tidak tersedia
            if (poster === "N/A") {

                poster =
                    "https://via.placeholder.com/300x400?text=No+Poster";

            }


            // ========================================
            // MEMASUKKAN DATA KE MODAL
            // ========================================

            $("#modal-title")
                .text(movie.Title);

            $("#modal-movie-title")
                .text(movie.Title);

            $("#modal-poster")
                .attr("src", poster);

            $("#modal-year")
                .text(movie.Year);

            $("#modal-genre")
                .text(movie.Genre);

            $("#modal-director")
                .text(movie.Director);

            $("#modal-actors")
                .text(movie.Actors);

            $("#modal-rating")
                .text(movie.imdbRating);

            $("#modal-runtime")
                .text(movie.Runtime);

            $("#modal-plot")
                .text(movie.Plot);

        },

        error: function (error) {

            console.log(error);

            alert("Gagal mengambil detail film.");

        }

    });

}