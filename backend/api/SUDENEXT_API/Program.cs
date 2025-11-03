using Microsoft.OpenApi.Models;
using AutoMapper;
using SUDENEXT.API.Extensions;
using SUDENEXT.BussinessLogic;

var builder = WebApplication.CreateBuilder(args);

// 1. Configuración de servicios
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", builder =>
    {
        builder.AllowAnyOrigin()
               .AllowAnyMethod()
               .AllowAnyHeader();
    });

    options.AddPolicy("AllowFlutter", builder =>
    {
        builder.SetIsOriginAllowed(origin => new Uri(origin).Host == "localhost")
               .AllowAnyHeader()
               .AllowAnyMethod();
    });
});

builder.Services.AddControllers();

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "SUDENEXT API", Version = "v1" });
});

// Tu capa de acceso a datos y lógica de negocio
builder.Services.DataAccess(builder.Configuration.GetConnectionString("ConexionSUDENEXT"));
builder.Services.BussinessLogic();

// AutoMapper (solo con typeof basta)
builder.Services.AddAutoMapper(typeof(MappingProfileExtensions));

// Si realmente usas vistas, deja esto. Si solo es API, elimínalo.
builder.Services.AddControllersWithViews();

// Sesión (si la necesitas)
builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession();

// 2. Configuración del pipeline
var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();
app.UseCors("AllowAll");
app.UseAuthorization();

app.MapControllers();

app.Run();

