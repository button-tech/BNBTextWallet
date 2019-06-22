namespace Discord.Bot
{
    using Microsoft.AspNetCore.Builder;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.DependencyInjection;
    using System;
    using System.Threading.Tasks;
    using EF;
    using EF.Repository;
    using Microsoft.EntityFrameworkCore;
    using Services;

    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        private string ReadEnv(string e) => Environment.GetEnvironmentVariable(e);

        public IServiceProvider ConfigureServices(IServiceCollection services)
        {
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2);

            services.AddSingleton<DiscordClient>();
            services.AddSingleton<BalanceService>();
            services.AddSingleton<TokenInfoRepository>();
            services.AddSingleton<GuidRepository>();
            services.AddSingleton<GuidService>();
            services.AddSingleton<AccountService>();
            services.AddSingleton<CoursesService>();
            services.AddSingleton<BinanceService>();

            var hostConfig = new HostConfig
            {
                DiscordBotToken = ReadEnv("BOT_TOKEN"),
                FrontAddress = ReadEnv("FRONT_ADDRESS"),
                ButtonNodeApi = ReadEnv("BUTTON_API")
            };
           

            services.AddSingleton(hostConfig);

            services.AddEntityFrameworkNpgsql();

            services.AddDbContext<HackContext>(options => options.UseNpgsql(ReadEnv("POSTGRE")),
                ServiceLifetime.Transient);

            Func<HackContext> Factory(IServiceProvider service)
            {
                var scope = service.CreateScope();
                var hack = scope.ServiceProvider.GetService<HackContext>();
                return () => hack;
            }

            services.AddSingleton(Factory);

            services.AddSingleton<Func<DateTimeOffset>>(() => DateTimeOffset.UtcNow);

            services.AddHttpClient();

            return services.BuildServiceProvider();
        }

        public void Configure(IApplicationBuilder app, IHostingEnvironment env, IServiceProvider serviceProvider)
        {
            var discord = serviceProvider.GetService<DiscordClient>();

            Task.Run(() => discord.Init());

            app.UseMvc();
        }
    }
}