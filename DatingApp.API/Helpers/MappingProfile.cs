using System;
using System.Linq;
using AutoMapper;
using DatingApp.API.Dtos;
using DatingApp.API.Models;

namespace DatingApp.API.Helpers
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<User, UserForListDto>()
                .ForMember(dest => dest.PhotoUrl, opt => {
                    opt.MapFrom(src => src.Photos.FirstOrDefault(p => p.IsMain == true).Url);
                })
                .ForMember(dest => dest.Age, opt => {
                    opt.ConvertUsing(new AgeConverter(), src => src.DateOfBirth); // https://docs.automapper.org/en/stable/Value-converters.html
                });
            //CreateMap<UserForListDto, User>();

            CreateMap<User, UserForDetailedDto>()
                .ForMember(dest => dest.PhotoUrl, opt => {
                        opt.MapFrom(src => src.Photos.FirstOrDefault(p => p.IsMain == true).Url);
                    })
                .ForMember(dest => dest.Age, opt => {
                    opt.ConvertUsing(new AgeConverter(), src => src.DateOfBirth); // https://docs.automapper.org/en/stable/Value-converters.html
                });
            //CreateMap<UserForDetailedDto, User>();

            CreateMap<Photo, PhotoForDetailedDto>();
        }
    }

    public class AgeConverter : IValueConverter<DateTime, int> 
    {
        public int Convert(DateTime source, ResolutionContext context)
            => source.CalculateAge();
    }
}