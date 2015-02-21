
package ONVIF::Media::Elements::GetAudioDecoderConfigurationsResponse;
use strict;
use warnings;

{ # BLOCK to scope variables

sub get_xmlns { 'http://www.onvif.org/ver10/media/wsdl' }

__PACKAGE__->__set_name('GetAudioDecoderConfigurationsResponse');
__PACKAGE__->__set_nillable();
__PACKAGE__->__set_minOccurs();
__PACKAGE__->__set_maxOccurs();
__PACKAGE__->__set_ref();

use base qw(
    SOAP::WSDL::XSD::Typelib::Element
    SOAP::WSDL::XSD::Typelib::ComplexType
);

our $XML_ATTRIBUTE_CLASS;
undef $XML_ATTRIBUTE_CLASS;

sub __get_attr_class {
    return $XML_ATTRIBUTE_CLASS;
}

use Class::Std::Fast::Storable constructor => 'none';
use base qw(SOAP::WSDL::XSD::Typelib::ComplexType);

Class::Std::initialize();

{ # BLOCK to scope variables

my %Configurations_of :ATTR(:get<Configurations>);

__PACKAGE__->_factory(
    [ qw(        Configurations

    ) ],
    {
        'Configurations' => \%Configurations_of,
    },
    {
        'Configurations' => 'ONVIF::Media::Types::AudioDecoderConfiguration',
    },
    {

        'Configurations' => 'Configurations',
    }
);

} # end BLOCK







} # end of BLOCK



1;


=pod

=head1 NAME

ONVIF::Media::Elements::GetAudioDecoderConfigurationsResponse

=head1 DESCRIPTION

Perl data type class for the XML Schema defined element
GetAudioDecoderConfigurationsResponse from the namespace http://www.onvif.org/ver10/media/wsdl.







=head1 PROPERTIES

The following properties may be accessed using get_PROPERTY / set_PROPERTY
methods:

=over

=item * Configurations

 $element->set_Configurations($data);
 $element->get_Configurations();





=back


=head1 METHODS

=head2 new

 my $element = ONVIF::Media::Elements::GetAudioDecoderConfigurationsResponse->new($data);

Constructor. The following data structure may be passed to new():

 {
   Configurations =>  { # ONVIF::Media::Types::AudioDecoderConfiguration
   },
 },

=head1 AUTHOR

Generated by SOAP::WSDL

=cut
