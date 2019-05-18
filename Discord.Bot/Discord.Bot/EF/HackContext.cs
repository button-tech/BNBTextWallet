namespace Discord.Bot.EF
{
    using Data;
    using Microsoft.EntityFrameworkCore;

    public class HackContext : DbContext
    {
        public HackContext(DbContextOptions options)
            : base(options)
        {
        }

        public DbSet<DiscordUserData> Users { get; set; }
        public DbSet<TokenInfoData> TokenInfos { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<DiscordUserData>()
                .HasIndex(x => x.Identifier)
                .IsUnique();
        }
    }
}