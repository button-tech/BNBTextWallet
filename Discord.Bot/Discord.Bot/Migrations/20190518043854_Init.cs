using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace Discord.Bot.Migrations
{
    public partial class Init : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<long>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    UserGuid = table.Column<string>(nullable: true),
                    NickName = table.Column<string>(nullable: true),
                    BitcoinAddress = table.Column<string>(nullable: true),
                    EthereumAddress = table.Column<string>(nullable: true),
                    StellarAddress = table.Column<string>(nullable: true),
                    LitecoinAddress = table.Column<string>(nullable: true),
                    BitcoinCashAddress = table.Column<string>(nullable: true),
                    WavesAddress = table.Column<string>(nullable: true),
                    EthereumClassicAddress = table.Column<string>(nullable: true),
                    FirstActionTime = table.Column<DateTimeOffset>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Users_UserGuid",
                table: "Users",
                column: "UserGuid",
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
