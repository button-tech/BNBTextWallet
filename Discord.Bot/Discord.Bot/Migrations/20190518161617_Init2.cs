using Microsoft.EntityFrameworkCore.Migrations;

namespace Discord.Bot.Migrations
{
    public partial class Init2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Users_UserGuid",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "BitcoinAddress",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "BitcoinCashAddress",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "EthereumClassicAddress",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "LitecoinAddress",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "StellarAddress",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "UserGuid",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "WavesAddress",
                table: "Users");

            migrationBuilder.AddColumn<decimal>(
                name: "Identifier",
                table: "Users",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.CreateIndex(
                name: "IX_Users_Identifier",
                table: "Users",
                column: "Identifier",
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Users_Identifier",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "Identifier",
                table: "Users");

            migrationBuilder.AddColumn<string>(
                name: "BitcoinAddress",
                table: "Users",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "BitcoinCashAddress",
                table: "Users",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "EthereumClassicAddress",
                table: "Users",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LitecoinAddress",
                table: "Users",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "StellarAddress",
                table: "Users",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UserGuid",
                table: "Users",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "WavesAddress",
                table: "Users",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_UserGuid",
                table: "Users",
                column: "UserGuid",
                unique: true);
        }
    }
}
